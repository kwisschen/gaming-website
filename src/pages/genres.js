import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import * as styles from '../styles/genre.module.css';

export default function GenresPage({ data }) {
  const { allGenre, allFile } = data;

  // Create an image map from the images provided
  const imageMap = {};
  allFile.nodes.forEach(file => {
    imageMap[file.name] = getImage(file);
  });

  return (
    <Layout>
      <div className={styles.headingContainer}>
        <h1>Top 1000 Games of All Time</h1>
        <h2>Sorted by Genre</h2>
      </div>
      <div className={styles.cardContainer}>
        {allGenre.nodes.map(genre => {
          // Generate the image file name
          const key = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/--+/g, '-').replace(/(^-|-$)/g, '');
          // Retrieve the corresponding image, or use the default one
          const image = imageMap[key] || imageMap["default"];

          return (
            <Link to={`/genre/${genre.slug}/`} className={styles.genreCard} key={genre.id}>
              <GatsbyImage
                image={image}
                alt={`Cover image for ${genre.name}`}
                className={styles.genreImage}
              />
              <div>
                <div className={styles.genreText}>{genre.name}</div>
                <span className={styles.genreCount}>{genre.gamesCount} Games</span>
              </div>
            </Link>
          );
        })}
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
    allFile(filter: {extension: {eq: "jpg"}, sourceInstanceName: {eq: "images"}, relativeDirectory: {eq: ""}}) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
    }
  }
`;
