// src/pages/language-page.js
import React, { useLayoutEffect } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import * as styles from "../styles/genre.module.css";
import defaultImage from "../images/default.jpg";

const LanguagePage = ({ data, pageContext }) => {
  const { allGame: { nodes: games } } = data;

  // Attempt to make each visit scroll to top of page
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (event) => {
    if (event.target.src !== defaultImage) {
      event.target.src = defaultImage;
    }
  };

  return (
    <Layout>
      <div className={styles.headingContainer}>
        <h1>Games Supporting Your Browser Language</h1>
        <h2>{`Locale: ${pageContext.locale}`}</h2>
      </div>
      <div className={styles.cardContainer}>
        {games.map((game) => (
          <Link to={`/game/${game.slug}/`} key={game.id} className={styles.gameCard}>
            <img
              src={game.coverUrl || defaultImage}
              alt={`Cover for ${game.name}`}
              className={styles.gameImage}
              onError={handleImageError}
            />
            <div className={styles.gameText}>{game.name}</div>
            <div className={styles.gameRating}>Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}</div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query LanguageGamesQuery($locale: String = "") {
    allGame(
      filter: { supportedLanguages: { elemMatch: { locale: { eq: $locale } } } }
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

export default LanguagePage;
