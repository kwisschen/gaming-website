// src/pages/index.js
import React, { useState, useRef, useEffect } from "react";
import { Link, graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/index.module.css";

const IndexPage = ({ data }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const formRef = useRef(null);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [languageUrl, setLanguageUrl] = useState(null);
  const [headerText, setHeaderText] = useState("Featured Game");
  const [languageButton, setLanguageButton] = useState(null);

  useEffect(() => {
    let userLocale = navigator.language || navigator.languages[0];
    const baseUserLocale = userLocale.split("-")[0];
    
    // Find exact match for locale
    const exactMatchGames = data.allGame.nodes.filter(game =>
      game.supportedLanguages.some(lang => lang.locale === userLocale)
    );
  
    if (exactMatchGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * exactMatchGames.length);
      const exactMatch = exactMatchGames[randomIndex];
      const matchingLanguage = exactMatch.supportedLanguages.find(lang => lang.locale === userLocale);
      const languageName = matchingLanguage ? matchingLanguage.name : "your language";
  
      setLanguageUrl(`/language/${matchingLanguage.locale}/`);
      setHeaderText("Recommended for you:");
      setFeaturedGame(exactMatch);
      setLanguageButton(
        <Link to={`/language/${matchingLanguage.locale}/`} className={styles.languageButton}>
          {`All ${languageName} Games`}
        </Link>
      );
    } else {
      // Fallback to matching the base language (e.g., "pt" for "pt-BR")
      const baseMatchGames = data.allGame.nodes.filter(game =>
        game.supportedLanguages.some(lang => lang.locale.split("-")[0] === baseUserLocale)
      );
  
      if (baseMatchGames.length > 0) {
        const randomIndex = Math.floor(Math.random() * baseMatchGames.length);
        const baseMatch = baseMatchGames[randomIndex];
        const matchingLanguage = baseMatch.supportedLanguages.find(lang => lang.locale.split("-")[0] === baseUserLocale);
        const languageName = matchingLanguage ? matchingLanguage.name : "your language";
  
        setLanguageUrl(`/language/${matchingLanguage.locale}/`);
        setHeaderText("Recommended for you:");
        setFeaturedGame(baseMatch);
        setLanguageButton(
          <Link to={`/language/${matchingLanguage.locale}/`} className={styles.languageButton}>
            {`All games in ${languageName}`}
          </Link>
        );
      } else {
        // Randomly select one from all games as the featured game
        const allGames = data.allGame.nodes;
        const randomIndex = Math.floor(Math.random() * allGames.length);
        setFeaturedGame(allGames[randomIndex]);
        setLanguageUrl(null);
        setHeaderText("Featured Game");
        setLanguageButton(null);
      }
    }
  }, [data, styles.languageButton]);  

  // Front-end validation for form
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /[\p{L}\p{M}]/u;
    return nameRegex.test(name) && name.trim() !== "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    if (!validateName(name)) {
      setNameError("Please enter a valid name.");
      valid = false;
    } else {
      setNameError(null);
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!valid) {
      return;
    }

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
    setNameError(null);
    setEmailError(null);
    formRef.current.reset();
  };

  return (
    <Layout>
      <div className={styles.heroSection}>
        <h1>This is <span>RBG</span>.</h1>
        <p>The best games ranked by gamers, for gamers.</p>
        <br />
        <Link to="/genres" className={styles.exploreButton}>Explore Games</Link>
      </div>

      {featuredGame && (
        <div className={styles.featuredGames}>
          <h2>{headerText}</h2>
          <div className={styles.cardContainer}>
            <Link to={`/game/${featuredGame.slug}/`} className={styles.gameCard}>
              <img src={featuredGame.coverUrl || "../images/default.jpg"} alt={`Cover for ${featuredGame.name}`} className={styles.gameImage} />
              <div className={styles.gameText}>{featuredGame.name}</div>
              <div className={styles.gameRating}>Rating: {featuredGame.rating ? featuredGame.rating.toFixed(1) : "N/A"}</div>
            </Link>
          </div>
          {languageButton}
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
            {nameError && <p className={styles.errorText}>{nameError}</p>}
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}
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
          name
          locale
        }
      }
    }
  }
`;

export default IndexPage;
