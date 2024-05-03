import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const GamePage = ({ data }) => {
  const { game } = data;

  return (
    <Layout>
      <div>
        {game ? (
          <>
            <h1>{game.name}</h1>
            {game.coverUrl && (
              <img
                src={game.coverUrl}
                style={{ objectFit: "contain", width: "20%", height: "20%", borderRadius: "10px" }}
                alt={`Cover image for ${game.name}`}
              />
            )}
            <h3>Rating:</h3>
            <p>{game.rating ? game.rating.toFixed(1) : "N/A"}</p>
            <h3>Release Date:</h3>
            <p>{game.firstReleaseDate ? new Date(game.firstReleaseDate).toLocaleDateString() : "Unknown"}</p>
            <h3>Platforms:</h3>
            {game.platforms && game.platforms.length > 0 ? (
              <ul>{game.platforms.map(platform => <li key={platform}>{platform}</li>)}</ul>
            ) : <p>Not available</p>}
            <h3>IGDB Webpage:</h3>
            {game.url ? <a href={game.url} target="_blank" rel="noopener noreferrer">{game.url}</a> : <p>Not available</p>}
            <h3>Description:</h3>
            <p>{game.summary || "No description available."}</p>
          </>
        ) : <p>Game not found.</p>}
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
      firstReleaseDate
      platforms
      url
    }
  }
`

export default GamePage
