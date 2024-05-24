// src/pages/about.js
import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/about.module.css";

const AboutPage = () => {
  return (
    <Layout>
      <Seo title="About" />
      <div className={styles.aboutContainer}>
        <Link to="/genres">
          <StaticImage
            src="../images/featured-default.jpg"
            alt="Featured"
            className={styles.featuredImage}
          />
        </Link>
        <h1>Our Story</h1><br/>
        <p>
          At RankedByGamers, we are passionate about gaming and strive to
          provide you with the latest information on the highest-rated games.
        </p>
        <p>
          Our mission is to help you discover top-rate games that support your preferred genre or language,
          whether you are just getting started or already a seasoned gamer.
        </p>
        <p>
          Explore our site to find ratings, screenshots, and much more for games that are available in your language.
        </p>
        <p>Welcome to your ultimate guide to the gaming world, and happy gaming, gamer.</p>
      </div>
    </Layout>
  );
};

export default AboutPage;
