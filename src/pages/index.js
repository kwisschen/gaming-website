import React, { useState, useRef, useEffect } from "react";
import { Link, graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/index.module.css";

const IndexPage = ({ data }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef(null);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [languageUrl, setLanguageUrl] = useState(null);
  const [headerText, setHeaderText] = useState("Featured Game");

  useEffect(() => {
    let userLocale = navigator.language || navigator.languages[0];

    // Handle specific cases for users using just "English" and "Chinese" as their Preferred Language in browser
    if (userLocale === "en") {
        userLocale = "en-US"; // mapping to "English (United States)"
    } else if (userLocale === "zh") {
        userLocale = "zh-CN"; // mapping to "Chinese (Simplified)"
    }

    // Filter games that support the user's preferred language
    const localeGames = data.allGame.nodes.filter(game =>
      game.supportedLanguages.some(lang => lang.locale === userLocale)
    );

    // Randomly select one of the locale-supported games as the featured game
    if (localeGames.length > 0) {
      setLanguageUrl(`/language/${userLocale}/`);
      setHeaderText("Featured game in YOUR language");
      const randomIndex = Math.floor(Math.random() * localeGames.length);
      setFeaturedGame(localeGames[randomIndex]);
    } else {
      // Randomly select one of all games as the featured game
      const allGames = data.allGame.nodes;
      const randomIndex = Math.floor(Math.random() * allGames.length);
      setFeaturedGame(allGames[randomIndex]);
      setLanguageUrl(null);
      setHeaderText("Featured Game");
    }
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const encData = new URLSearchParams(formData).toString();

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encData,
      });

      if (response.ok) {
        formRef.current.reset();
        navigate("/confirm-page");
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Submission error: ${error}`);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    formRef.current.reset();
  };

  return (
    <Layout>
      <div className={styles.heroSection}>
        <h1>This is <span>RBG</span>.</h1>
        <p>Best-quality games ranked by gamers, for gamers.</p>
        <br />
        <Link to="/genres" className={styles.exploreButton}>Explore Games</Link>
      </div>

      {featuredGame && (
        <div className={styles.featuredGames}>
          <h2>{headerText}</h2>
          <div className={styles.cardContainer}>
            <Link to={`/game/${featuredGame.slug}/`} className={styles.gameCard}>
              <img src={featuredGame.coverUrl || '../images/default.jpg'} alt={`Cover for ${featuredGame.name}`} className={styles.gameImage} />
              <div className={styles.gameText}>{featuredGame.name}</div>
              <div className={styles.gameRating}>Rating: {featuredGame.rating ? featuredGame.rating.toFixed(1) : "N/A"}</div>
            </Link>
          </div>

          {languageUrl && (
            <Link to={languageUrl} className={styles.languageButton}>
              Games in Your Language
            </Link>
          )}
        </div>
      )}

      <div className={styles.newsletterForm}>
        <h2>Subscribe to our newsletter!</h2>
        <form
          name="Data Collection Form"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <input type="hidden" name="form-name" value="Data Collection Form" />
          <label>
            Name
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <div className={styles.formButtons}>
            <button type="submit">Send</button>
            <button type="button" onClick={handleReset}>Clear</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Home" />

export const query = graphql`
  {
    allGame {
      nodes {
        id
        name
        rating
        slug
        coverUrl
        supportedLanguages {
          locale
        }
      }
    }
  }
`;

export default IndexPage;
