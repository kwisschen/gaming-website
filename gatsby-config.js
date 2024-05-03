/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `RankedByGamers`,
    description: `Gatsby project for Final Project in CSCI E-114`,
    course: `CSCI E-114`,
    author: `Christopher Chen`,
    siteUrl: `http://localhost:8000`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
  ],
}
