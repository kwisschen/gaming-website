import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default function GenresPage({ data }) {
  const { allGenre } = data

  return (
    <Layout>
      <h1>Highest-Rated Games of All Time</h1>
      <h2>Top 500 games sorted by Genre</h2>
      <ul>
        {allGenre.nodes.map(genre => (
          <li key={genre.id}>
            <Link to={`/genre/${genre.slug}/`}>
              {genre.name} ({genre.gamesCount})
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query GenresQuery {
    allGenre {
      nodes {
        id
        name
        slug
        gamesCount
      }
    }
  }
`
