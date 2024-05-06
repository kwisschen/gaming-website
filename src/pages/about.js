// src/pages/about.js
import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import featuredImage from "../images/featured-default.jpg";
import * as styles from "../styles/about.module.css";

const AboutPage = () => {
  return (
    <Layout>
      <Seo title="About" />
      <div className={styles.aboutContainer}>
        <Link to="/genres">
          <img
            src={featuredImage}
            alt="Featured"
            className={styles.featuredImage}
          />
        </Link>
        <h1>About Ranked-By-Gamers</h1>
        <p>Welcome to your ultimate guide to the gaming world!</p>
        <p>
          At RankedByGamers, we are passionate about gaming and strive to
          provide you with the latest information on the highest-rated games.
        </p>
        <p>
          Our mission is to help you discover new and exciting games to play,
          whether you&apos;re a seasoned gamer or just getting started.
        </p>
        <p>
          Explore our website to find ratings, descriptions, and more. Happy
          gaming!
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
