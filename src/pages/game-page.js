import React, { useState } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import * as styles from '../styles/game.module.css';

const GamePage = ({ data }) => {
    const { game } = data;
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % game.screenshots.length);
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + game.screenshots.length) % game.screenshots.length);
    };

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
                                <h3>Rating:</h3>
                                <p>{game.rating ? game.rating.toFixed(1) : "N/A"}</p>
                                <h3>Release Date:</h3>
                                <p>{game.firstReleaseDate ? new Date(game.firstReleaseDate).toLocaleDateString() : "Unknown"}</p>
                                <h3>Platforms:</h3>
                                {game.platforms && game.platforms.length > 0 ? (
                                    <ul>{game.platforms.map(platform => <li key={platform}>{platform}</li>)}</ul>
                                ) : <p>Not available</p>}
                                <h3>Description:</h3>
                                <p>{game.summary || "No description available."}</p>
                                <p>More information at: {game.url ? <a href={game.url} target="_blank" rel="noopener noreferrer">{game.url}</a> : "Not available"}</p>
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
                                    />
                                    <button className={styles.carouselArrow} onClick={nextSlide}>
                                        &#9654;
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : <p>Game not found.</p>}
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
    }
  }
`;

export default GamePage;
