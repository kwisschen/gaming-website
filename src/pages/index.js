import React, { useState, useRef } from "react";
import { Link, navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/index.module.css";

const IndexPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const formRef = useRef(null);  // Reference to the form

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
        <p>The best games ranked by gamers, for gamers.</p>
        <br />
        <Link to="/genres" className={styles.exploreButton}>Explore Games</Link>
      </div>

      <div className={styles.featuredGames}>
        <h2>Featured Game</h2>
        <div className={styles.gamesGrid}>
          <div className={styles.gameCard}>
            <StaticImage
              src="../images/ai-gaming.jpg"
              alt="Game Image"
              placeholder="blurred"
              layout="constrained"
            />
            <h3>Game Title</h3>
            <p>Short description of a randomly chosen game to entice users.</p>
          </div>
        </div>
      </div>

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
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Email:
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

export default IndexPage;
