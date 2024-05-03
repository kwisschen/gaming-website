import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import * as styles from '../styles/genre.module.css';

export default function GenresPage({ data }) {
  const { allGenre } = data;

  return (
    <Layout>
      <h1>Top 1000 Games of All Time</h1>
      <h2>Sorted by genre</h2>
      <div className={styles.cardContainer}>
        {allGenre.nodes.map(genre => (
          <Link to={`/genre/${genre.slug}/`} className={styles.genreCard} key={genre.id}>
            <div className={styles.genreImage}></div> {/* Placeholder for genre image */}
            <div>
              <div className={styles.genreText}>{genre.name}</div>
              <span className={styles.genreCount}>{genre.gamesCount} Games</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
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
`;
