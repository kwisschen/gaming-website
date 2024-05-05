import React, { useState, useRef, useEffect } from "react";
import { Link, graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/index.module.css";

const IndexPage = ({ data }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef(null);  // Reference to the form
  const [featuredGame, setFeaturedGame] = useState(null);

  useEffect(() => {
    // Fetch the user's preferred language (replace with actual logic)
    const userPreferredLanguage = "English"; // Replace with actual logic
    
    // Filter games that support the user's preferred language
    const games = data.allGame.nodes.filter(game =>
      game.supportedLanguages.includes(userPreferredLanguage)
    );

    // Randomly select one of the filtered games
    if (games.length > 0) {
      const randomIndex = Math.floor(Math.random() * games.length);
      setFeaturedGame(games[randomIndex]);
    }
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);  // Access form data wit useRef
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
        formRef.current.reset();  // Reset the form using the ref
        navigate("/confirm-page");  // Navigate on successful submission
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error:', error);
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
          <h2>Featured game in YOUR language</h2>
          <div className={styles.cardContainer}>
            <Link to={`/game/${featuredGame.slug}/`} className={styles.gameCard}>
              <img src={featuredGame.coverUrl || '../images/default.jpg'} alt={`Cover for ${featuredGame.name}`} className={styles.gameImage} />
              <div className={styles.gameText}>{featuredGame.name}</div>
              <div className={styles.gameRating}>Rating: {featuredGame.rating ? featuredGame.rating.toFixed(1) : "N/A"}</div>
            </Link>
          </div>
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
              value={email}
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
        supportedLanguages
      }
    }
  }
`;

export default IndexPage;
