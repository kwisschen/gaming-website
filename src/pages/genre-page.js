import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const GenrePage = ({ data, pageContext }) => {
  const {
    allGame: { nodes: games },
  } = data

  return (
    <Layout>
      <h1>Games in Genre: {pageContext.genreName}</h1>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            <Link to={`/game/${game.slug}/`}>{game.name}</Link> - Rating:{" "}
            {game.rating ? game.rating.toFixed(1) : "N/A"}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query GenreGamesQuery($genreId: String = "") {
    allGame(
      filter: { genres: { elemMatch: { id: { eq: $genreId } } } }
      sort: { rating: DESC }
    ) {
      nodes {
        id
        name
        rating
        slug
      }
    }
  }
`

export default GenrePage
