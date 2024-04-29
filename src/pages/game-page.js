import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const GamePage = ({ data }) => {
  const { game } = data

  return (
    <Layout>
      <div>
        {game && (
          <>
            <h1>{game.name}</h1>
            {game.coverUrl && (
              <img
                src={game.coverUrl}
                style={{
                  objectFit: "contain",
                  width: "20%",
                  height: "20%",
                  borderRadius: "10px",
                }}
                alt={`Cover image for ${game.name}`}
              />
            )}
            <h3>Rating:</h3>
            <p>{game.rating ? game.rating.toFixed(1) : "N/A"}</p>
            <h3>Description:</h3>
            <p>{game.summary}</p>
          </>
        )}
        {!game && <p>Game not found.</p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query GameQuery($gameId: String = "") {
    game(id: { eq: $gameId }) {
      id
      name
      rating
      coverUrl
      summary
    }
  }
`

export default GamePage
