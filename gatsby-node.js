// gatsby-node.js
const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");

const IGDB_API_URL = "https://api.igdb.com/v4";
const HEADERS = {
  Accept: "application/json",
  "Client-ID": process.env.IGDB_CLIENT_ID,
  Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
};

// Convert IGDB image URLs to specified resolution
function convertImageUrl(url, size = "t_720p") {
  if (!url) return "";
  const baseUrl = url.startsWith("http") ? "" : "https:";
  return `${baseUrl}${url.replace("t_thumb", size)}`;
}

// Fetch data from IGDB with retry mechanism
async function fetchIGDBDataWithRetry(
  endpoint,
  query,
  retryCount = 2,
  retryDelay = 1000
) {
  let response;
  for (let attempt = 0; attempt < retryCount; attempt++) {
    response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
      method: "POST",
      headers: HEADERS,
      body: query,
    });
    if (response.ok) {
      return await response.json();
    }
    console.error(
      `Attempt ${attempt + 1}: Failed with status ${response.status}`
    );
    if (response.status !== 429) {
      // Not a rate limit error
      const message = await response.text();
      console.error(`Error response body: ${message}`);
      throw new Error(
        `Failed to fetch from IGDB: ${response.status} ${response.statusText} - ${message}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }
  throw new Error("Failed after multiple retries.");
}

// Fetch data in chunks
async function fetchDataInChunks(fetchFunction, ids, chunkSize = 10) {
  const data = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    try {
      const response = await fetchFunction(chunk);
      data.push(...response);
    } catch (error) {
      console.error("Failed to fetch data for chunk:", chunk, error);
    }
  }
  return data;
}

// Fetch platform names by IDs
async function fetchPlatforms(platformIds) {
  return fetchDataInChunks(
    (chunk) =>
      fetchIGDBDataWithRetry(
        "platforms",
        `fields name; where id = (${chunk.join(",")});`
      ),
    platformIds
  );
}

// Fetch language supports by IDs
async function fetchLanguageSupports(languageSupportIds) {
  return fetchDataInChunks(
    (chunk) =>
      fetchIGDBDataWithRetry(
        "language_supports",
        `fields game,language; where id = (${chunk.join(",")});`
      ),
    languageSupportIds
  );
}

// Fetch languages by IDs
async function fetchLanguages(languageIds) {
  return fetchDataInChunks(
    (chunk) =>
      fetchIGDBDataWithRetry(
        "languages",
        `fields name,locale; where id = (${chunk.join(",")});`
      ),
    languageIds
  );
}

// Fetch screenshots by IDs
async function fetchScreenshots(screenshotIds) {
  return fetchDataInChunks(
    (chunk) =>
      fetchIGDBDataWithRetry(
        "screenshots",
        `fields url; where id = (${chunk.join(",")});`
      ),
    screenshotIds
  );
}

// Fetch involved_companies by IDs with enhanced logging and error handling
async function fetchInvolvedCompanies(companyIds) {
  // Simplifying the query to test basic functionality
  const query = `fields company,developer; where id = (${companyIds.join(
    ","
  )});`;

  console.log("Querying involved_companies with:", query); // Log the full query

  try {
    const data = await fetchDataInChunks(
      (chunk) =>
        fetchIGDBDataWithRetry(
          "involved_companies",
          `fields company,developer; where id = (${chunk.join(",")});`
        ),
      companyIds
    );
    console.log("Fetch successful, data:", data); // Log successful fetch data
    return data;
  } catch (error) {
    console.error("Error fetching involved companies:", error.message);
    throw error;
  }
}

// Fetch companies by IDs
async function fetchCompanies(companyIds) {
  return fetchDataInChunks(
    (chunk) =>
      fetchIGDBDataWithRetry(
        "companies",
        `fields name; where id = (${chunk.join(",")});`
      ),
    companyIds
  );
}

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  // Fetch data from IGDB
  const genres = await fetchIGDBDataWithRetry(
    "genres",
    "fields name; limit 50;"
  );
  const games = await fetchIGDBDataWithRetry(
    "games",
    `fields name, rating, genres, cover.url, summary, first_release_date, platforms, url, screenshots, language_supports, involved_companies;
    where rating >= 90;
    sort rating desc;
    limit 500;`
  );

  // Extract all platform IDs and language support IDs from games
  const platformIds = new Set();
  const screenshotIds = new Set();
  const languageSupportIds = new Set();
  games.forEach((game) => {
    if (game.platforms) {
      game.platforms.forEach((platformId) => platformIds.add(platformId));
    }
    if (game.screenshots) {
      game.screenshots
        .slice(0, 3)
        .forEach((screenshotId) => screenshotIds.add(screenshotId));
    }
    if (game.language_supports) {
      game.language_supports.forEach((languageSupportId) =>
        languageSupportIds.add(languageSupportId)
      );
    }
  });

  // Fetch platform details
  const platforms = await fetchPlatforms(Array.from(platformIds));
  const platformMap = platforms.reduce((map, platform) => {
    map[platform.id] = platform.name;
    return map;
  }, {});

  // Fetch language support details
  const languageSupports = await fetchLanguageSupports(
    Array.from(languageSupportIds)
  );
  const languageSupportMap = languageSupports.reduce((map, languageSupport) => {
    if (!map[languageSupport.game]) {
      map[languageSupport.game] = new Set();
    }
    map[languageSupport.game].add(languageSupport.language);
    return map;
  }, {});

  // Fetch languages details
  const languageIds = Array.from(
    new Set(languageSupports.map((support) => support.language))
  );
  const languages = await fetchLanguages(languageIds);
  const languageMap = languages.reduce((map, language) => {
    map[language.id] = { name: language.name, locale: language.locale };
    return map;
  }, {});

  // Fetch screenshot details
  const screenshots = await fetchScreenshots(Array.from(screenshotIds));
  const screenshotMap = screenshots.reduce((map, screenshot) => {
    map[screenshot.id] = convertImageUrl(screenshot.url);
    return map;
  }, {});

  // Fetch involved company IDs and then company details
  const involvedCompanyIds = new Set();
  games.forEach((game) => {
    if (game.involved_companies) {
      game.involved_companies.forEach((company) =>
        involvedCompanyIds.add(company)
      );
    }
  });

  const involvedCompanies = await fetchInvolvedCompanies(
    Array.from(involvedCompanyIds)
  );
  const companies = await fetchCompanies(
    involvedCompanies.map((ic) => ic.company)
  );
  const companyMap = companies.reduce((map, company) => {
    map[company.id] = company.name;
    return map;
  }, {});

  // Initialize an object to keep track of games count per genre
  const genreGamesCount = {};
  // Iterate over games to count the number of games per genre
  games.forEach((game) => {
    if (game.genres) {
      game.genres.forEach((genreId) => {
        genreGamesCount[genreId] = (genreGamesCount[genreId] || 0) + 1;
      });
    }
  });

  // Create nodes for genres with the additional gamesCount information
  genres.forEach((genre) => {
    const genreSlug = genre.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-\([^)]+\)$/, ""); // Handle parentheses in slugs
    createNode({
      ...genre,
      slug: genreSlug,
      id: createNodeId(`Genre-${genre.id}`),
      gamesCount: genreGamesCount[genre.id] || 0, // Games count for the genre
      internal: {
        type: "Genre",
        contentDigest: createContentDigest(genre),
      },
    });
  });

  // Create nodes for games, linking to genres by ID
  games.forEach((game) => {
    const gameSlug = game.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const genreNodeIds = game.genres
      ? game.genres.map((genreId) => createNodeId(`Genre-${genreId}`))
      : [];
    const screenshots = game.screenshots
      ? game.screenshots
          .slice(0, 3)
          .map((screenshotId) => screenshotMap[screenshotId])
      : [];
    const languageSupports = languageSupportMap[game.id] || new Set();
    const supportedLanguages = Array.from(languageSupports).map(
      (languageId) => {
        const language = languageMap[languageId] || {
          name: "Unknown",
          locale: "",
        };
        return { name: language.name, locale: language.locale };
      }
    );

    // Use a Set to avoid redundant listing of developer names
    let developerNamesSet = new Set();

    // Add developers to the Set
    (game.involved_companies || [])
      .map((companyId) =>
        involvedCompanies.find((ic) => ic.id === companyId && ic.developer)
      )
      .filter((ic) => ic) // Ensure the company is marked as developer and exists
      .forEach((ic) =>
        developerNamesSet.add(companyMap[ic.company] || "Unknown")
      );

    // Check if no developers were found and add all companies as a fallback
    if (developerNamesSet.size === 0) {
      (game.involved_companies || [])
        .map((companyId) => involvedCompanies.find((ic) => ic.id === companyId))
        .filter((ic) => ic) // Ensure the company exists
        .forEach((ic) =>
          developerNamesSet.add(companyMap[ic.company] || "Unknown")
        );
    }

    // Convert Set back to array for storing in Gatsby's data layer
    const gameDeveloperNames = Array.from(developerNamesSet);

    createNode({
      ...game,
      slug: gameSlug,
      coverUrl: convertImageUrl(game.cover?.url),
      firstReleaseDate: game.first_release_date
        ? new Date(game.first_release_date * 1000)
        : null,
      platforms: game.platforms
        ? game.platforms.map(
            (platformId) => platformMap[platformId] || "Unknown"
          )
        : [],
      url: game.url ? game.url : "",
      genres: genreNodeIds,
      screenshots,
      supportedLanguages,
      developers: gameDeveloperNames.length
        ? gameDeveloperNames
        : ["Not available"],
      id: createNodeId(`Game-${game.id}`),
      internal: {
        type: "Game",
        contentDigest: createContentDigest(game),
      },
    });
  });
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Fetch genres
  const genresResult = await graphql(`
    {
      allGenre {
        nodes {
          id
          slug
          name
        }
      }
    }
  `);

  // Create pages for genres
  if (genresResult.data) {
    genresResult.data.allGenre.nodes.forEach((genre) => {
      createPage({
        path: `/genre/${genre.slug}/`,
        component: path.resolve(`./src/pages/genre-page.js`),
        context: {
          genreId: genre.id,
          genreName: genre.name,
        },
      });
    });
  }

  // Fetch games
  const gamesResult = await graphql(`
    {
      allGame {
        nodes {
          id
          slug
          supportedLanguages {
            name
            locale
          }
        }
      }
    }
  `);

  if (gamesResult.data) {
    // Create game pages
    gamesResult.data.allGame.nodes.forEach((game) => {
      createPage({
        path: `/game/${game.slug}/`,
        component: path.resolve(`./src/pages/game-page.js`),
        context: {
          gameId: game.id,
        },
      });
    });

    // Create language pages
    const uniqueLocales = new Map();

    gamesResult.data.allGame.nodes.forEach((game) => {
      if (game.supportedLanguages) {
        game.supportedLanguages.forEach((language) => {
          uniqueLocales.set(language.locale, language.name);
        });
      }
    });

    uniqueLocales.forEach((name, locale) => {
      createPage({
        path: `/language/${locale}/`,
        component: path.resolve(`./src/pages/language-page.js`),
        context: {
          locale,
          name,
        },
      });
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type SupportedLanguage {
      name: String!
      locale: String!
    }

    type Game implements Node @dontInfer {
      name: String!
      rating: Float
      slug: String!
      coverUrl: String
      summary: String
      firstReleaseDate: Date @dateformat
      platforms: [String]
      url: String
      genres: [Genre] @link(by: "id")
      screenshots: [String]
      supportedLanguages: [SupportedLanguage]
      developers: [String]
    }

    type Genre implements Node @dontInfer {
      genreId: String!
      name: String!
      slug: String!
      gamesCount: Int
    }
  `);
};

if (process.env.NODE_ENV === "test") {
  exports.fetchIGDBData = fetchIGDBDataWithRetry;
}
