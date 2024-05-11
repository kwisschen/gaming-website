// src/pages/game-page.js
import React, { useState, useRef, useEffect } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import * as styles from "../styles/game.module.css";

const GamePage = ({ data }) => {
  const { game } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalContentRef = useRef(null); // Reference to the modal content for detecting outside clicks

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % game.screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (currentIndex - 1 + game.screenshots.length) % game.screenshots.length
    );
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      <div className={styles.gameContainer}>
        {game ? (
          <>
            <div className={styles.gameHeader}>
              <div className={styles.gameCoverContainer}>
                {game.coverUrl && (
                  <img
                    src={game.coverUrl}
                    alt={`Cover for ${game.name}`}
                    className={styles.gameCover}
                  />
                )}
              </div>
              <div className={styles.gameDetails}>
                <h1>{game.name}</h1>
                <h2>Rating:</h2>
                <p>{game.rating ? game.rating.toFixed(1) : "N/A"}</p>

                <h2>Developers:</h2>
                {game.developers && game.developers.length > 0 ? (
                  <ul>
                    {game.developers.map((developer) => (
                      <li key={developer}>{developer}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Not available</p>
                )}
                
                <h2>Release Date:</h2>
                <p>
                  {game.firstReleaseDate
                    ? new Date(game.firstReleaseDate).toLocaleDateString()
                    : "Unknown"}
                </p>
                <h2>Platforms:</h2>
                {game.platforms && game.platforms.length > 0 ? (
                  <ul>
                    {game.platforms.map((platform) => (
                      <li key={platform}>{platform}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Not available</p>
                )}
                <h2>Supported Languages:</h2>
                <p>
                  {game.supportedLanguages && game.supportedLanguages.length > 0
                    ? game.supportedLanguages
                        .map((lang) => lang.name)
                        .join(", ")
                    : "None specified"}
                </p>
                <h2>Description:</h2>
                <p>{game.summary || "No description available."}</p>
                <p>
                  More information at:{" "}
                  {game.url ? (
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {game.url}
                    </a>
                  ) : (
                    "Not available"
                  )}
                </p>
              </div>
            </div>
            {game.screenshots && game.screenshots.length > 0 && (
              <div className={styles.carouselContainer}>
                <h2 className={styles.carouselHeading}>Screenshots</h2>
                <div className={styles.carouselInner}>
                  <button className={styles.carouselArrow} onClick={prevSlide}>
                    &#9664;
                  </button>
                  <img
                    src={game.screenshots[currentIndex]}
                    alt={`Screenshot ${currentIndex + 1}`}
                    className={styles.screenshot}
                    onClick={openModal}
                  />
                  <button className={styles.carouselArrow} onClick={nextSlide}>
                    &#9654;
                  </button>
                </div>

                {/* Modal for enlarged screenshot */}
                <div
                  className={`${styles.modal} ${
                    isModalOpen ? styles.open : ""
                  }`}
                >
                  <div className={styles.modalContent} ref={modalContentRef}>
                    <span className={styles.close} onClick={closeModal}>
                      &times;
                    </span>
                    <img
                      src={game.screenshots[currentIndex]}
                      alt={`Screenshot ${currentIndex + 1}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Game not found.</p>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query GameQuery($gameId: String = "") {
    game(id: { eq: $gameId }) {
      id
      name
      rating
      coverUrl
      summary
      firstReleaseDate
      platforms
      url
      screenshots
      supportedLanguages {
        name
        locale
      }
      developers
    }
  }
`;

export default GamePage;
