/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Game Grapes`,
    description: `Gatsby project for Final Project in CSCI E-114`,
    course: `CSCI E-114`,
    author: `Christopher Chen`,
    siteUrl: `http://localhost:8000`,
  },
  flags: {
    PARALLEL_QUERY_RUNNING: true
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
  ],
}
