// src/pages/genre-page.js
import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import * as styles from "../styles/genre.module.css";
import defaultImage from "../images/default.jpg";

const GenrePage = ({ data, pageContext }) => {
  const {
    allGame: { nodes: games },
  } = data;

  const handleImageError = (event) => {
    if (event.target.src !== defaultImage) {
      event.target.src = defaultImage;
    }
  };

  return (
    <Layout>
      <div className={styles.headingContainer}>
        <h1>{pageContext.genreName} Games</h1>
        <h2>Sorted by Rating</h2>
        <Link to="/genres" className={styles.backButton}>
          Back to Genres
        </Link>
      </div>

      {games.length > 0 ? (
        <div className={styles.cardContainer}>
          {games.map((game) => (
            <Link
              to={`/game/${game.slug}/`}
              key={game.id}
              className={styles.gameCard}
            >
              <img
                src={game.coverUrl || defaultImage}
                alt={`Cover for ${game.name}`}
                className={styles.gameImage}
                onError={handleImageError}
              />
              <div className={styles.gameText}>{game.name}</div>
              <div className={styles.gameRating}>
                Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyText}>
          <h2>Whoops, there are no top-rated games in this genre... yet.</h2>
        </div>
      )}
    </Layout>
  );
};

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
        coverUrl
      }
    }
  }
`;

export default GenrePage;
