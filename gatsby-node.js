const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");

const IGDB_API_URL = "https://api.igdb.com/v4";
const HEADERS = {
  'Accept': 'application/json',
  'Client-ID': process.env.IGDB_CLIENT_ID,
  'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
};

// Convert IGDB image URLs to specified resolution
function convertImageUrl(url, size = 't_720p') {
  if (!url) return '';
  const baseUrl = url.startsWith('http') ? '' : 'https:';
  return `${baseUrl}${url.replace('t_thumb', size)}`;
}

// Fetch platform names by IDs
async function fetchPlatforms(platformIds) {
  const chunkSize = 10;
  const platformData = [];
  for (let i = 0; i < platformIds.length; i += chunkSize) {
    const chunk = platformIds.slice(i, i + chunkSize);
    const query = `fields name; where id = (${chunk.join(',')});`;
    try {
      const response = await fetchIGDBData('platforms', query);
      platformData.push(...response);
    } catch (error) {
      console.error("Failed to fetch platforms for chunk:", chunk, error);
    }
  }
  return platformData;
}

// Fetch screenshots by IDs
async function fetchScreenshots(screenshotIds) {
  const chunkSize = 10;
  const screenshotData = [];
  for (let i = 0; i < screenshotIds.length; i += chunkSize) {
    const chunk = screenshotIds.slice(i, i + chunkSize);
    const query = `fields url; where id = (${chunk.join(',')});`;
    try {
      const response = await fetchIGDBData('screenshots', query);
      screenshotData.push(...response);
    } catch (error) {
      console.error("Failed to fetch screenshots for chunk:", chunk, error);
    }
  }
  return screenshotData;
}

async function fetchIGDBData(endpoint, query) {
  const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
    method: 'POST',
    headers: HEADERS,
    body: query,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to fetch from IGDB: ${response.status} ${response.statusText} - ${message}`);
  }
  return response.json();
}

exports.sourceNodes = async ({ actions, createContentDigest, createNodeId }) => {
  const { createNode } = actions;

  // Fetch data from IGDB
  const genres = await fetchIGDBData('genres', "fields name; limit 50;");
  const games = await fetchIGDBData('games', `fields name, rating, genres, cover.url, summary, first_release_date, platforms, url, screenshots;
    where rating >= 60;
    sort rating desc;
    limit 500;`);

  // Extract all platform IDs from games
  const platformIds = new Set();
  const screenshotIds = new Set();
  games.forEach(game => {
    if (game.platforms) {
      game.platforms.forEach(platformId => platformIds.add(platformId));
    }
    if (game.screenshots) {
      game.screenshots.slice(0, 3).forEach(screenshotId => screenshotIds.add(screenshotId));
    }
  });

  // Fetch platform details
  const platforms = await fetchPlatforms(Array.from(platformIds));
  const platformMap = platforms.reduce((map, platform) => {
    map[platform.id] = platform.name;
    return map;
  }, {});

  // Fetch screenshot details
  const screenshots = await fetchScreenshots(Array.from(screenshotIds));
  const screenshotMap = screenshots.reduce((map, screenshot) => {
    map[screenshot.id] = convertImageUrl(screenshot.url);
    return map;
  }, {});

  // Initialize an object to keep track of games count per genre
  const genreGamesCount = {};
  // Iterate over games to count the number of games per genre
  games.forEach(game => {
    if (game.genres) {
      game.genres.forEach(genreId => {
        genreGamesCount[genreId] = (genreGamesCount[genreId] || 0) + 1;
      });
    }
  });

  // Create nodes for genres with the additional gamesCount information
  genres.forEach(genre => {
    const genreSlug = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-\([^)]+\)$/, ''); // Handle parentheses in slugs
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
  games.forEach(game => {
    const gameSlug = game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const genreNodeIds = game.genres ? game.genres.map(genreId => createNodeId(`Genre-${genreId}`)) : [];
    const screenshots = game.screenshots ? game.screenshots.slice(0, 3).map(screenshotId => screenshotMap[screenshotId]) : [];

    createNode({
      ...game,
      slug: gameSlug,
      coverUrl: convertImageUrl(game.cover?.url),
      firstReleaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
      platforms: game.platforms ? game.platforms.map(platformId => platformMap[platformId] || 'Unknown') : [],
      url: game.url ? game.url : "",
      genres: genreNodeIds,
      screenshots,
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

  const genresResult = await graphql(`
    {
      allGenre {
        nodes {
          id
          slug
        }
      }
    }
  `);

  genresResult.data.allGenre.nodes.forEach(genre => {
    createPage({
      path: `/genre/${genre.slug}/`,
      component: path.resolve(`./src/pages/genre-page.js`),
      context: {
        genreId: genre.id,
      },
    });
  });

  const gamesResult = await graphql(`
    {
      allGame {
        nodes {
          id
          slug
        }
      }
    }
  `);

  gamesResult.data.allGame.nodes.forEach(game => {
    createPage({
      path: `/game/${game.slug}/`,
      component: path.resolve(`./src/pages/game-page.js`),
      context: {
        gameId: game.id,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
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
    }
    type Genre implements Node @dontInfer {
      genreId: String!
      name: String!
      slug: String!
      gamesCount: Int
    }
  `);
};

if (process.env.NODE_ENV === 'test') {
  exports.fetchIGDBData = fetchIGDBData;
}
