const fetch = require("node-fetch");
require("dotenv").config();
const path = require("path");

const IGDB_API_URL = "https://api.igdb.com/v4";
const HEADERS = {
  'Accept': 'application/json',
  'Client-ID': process.env.IGDB_CLIENT_ID,
  'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
};

// Added helper function to convert image URLs to high resolution according to IGDB docs
function convertCoverUrl(url, size = 't_1080p') {
  if (!url) return '';
  const baseUrl = url.startsWith('http') ? '' : 'https:';
  return `${baseUrl}${url.replace('t_thumb', size)}`;
}

// Added helper function to fetch platform names by IDs
async function fetchPlatforms(platformIds) {
  const chunkSize = 10; // Needs to be a smaller number or IDs will go missing ('10' is the default item limit for IGDB)
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

async function fetchIGDBData(endpoint, query) {
  const response = await fetch(`${IGDB_API_URL}/${endpoint}`, {
    method: 'POST',
    headers: HEADERS,
    body: query,
  });
  console.log(response);
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
  //console.log("Genres fetched:", genres);
  const games = await fetchIGDBData('games', "fields name, rating, genres, cover.url, summary, first_release_date, platforms, url; where rating >= 60; sort rating desc; limit 500;");
  //console.log("Games fetched:", games);
  console.log("Games fetched:", games.map(game => ({ name: game.name, platforms: game.platforms })));

  // Extract all platform IDs from games
  const platformIds = new Set();
  games.forEach(game => {
    if (game.platforms) {
      game.platforms.forEach(platformId => platformIds.add(platformId));
    }
  });

  // Fetch platform details
  const platforms = await fetchPlatforms(Array.from(platformIds));
  const platformMap = platforms.reduce((map, platform) => {
    map[platform.id] = platform.name;
    return map;
  }, {});
  console.log("Missing Platform IDs:", Array.from(platformIds).filter(id => !platformMap[id]));


  // Initialize an object to keep track of games count per genre
  const genreGamesCount = {};
  // Iterate over games to count the number of games per genre
  games.forEach(game => {
    // Ensure game.genres exists before iterating over it
    if (game.genres) {
      game.genres.forEach(genreId => {
        // If the genreId does not exist in the object, initialize it with 1, else increment the count
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
    // Check if game.genres exists before mapping over it
    const genreNodeIds = game.genres ? game.genres.map(genreId => createNodeId(`Genre-${genreId}`)) : [];
    
    createNode({
      ...game,
      slug: gameSlug,
      coverUrl: convertCoverUrl(game.cover?.url), // Adjusted to use high-resolution images
      firstReleaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null, // Handle any missing date
      platforms: game.platforms ? game.platforms.map(platformId => platformMap[platformId] || 'Unknown') : [], // Map and handle missing platforms
      url: game.url ? game.url : "", // Handle any missing URL
      genres: genreNodeIds,
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