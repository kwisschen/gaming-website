// src/components/search.js
import React, { useState, useEffect, useRef } from "react";
import { navigate, useStaticQuery, graphql } from "gatsby";
import * as styles from "../styles/search.module.css";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const ref = useRef(null);

  const data = useStaticQuery(graphql`
    query {
      allGame {
        nodes {
          name
          slug
        }
      }
    }
  `);

  useEffect(() => {
    if (input.length >= 2) {
      const searchInput = input.toLowerCase();
      const filteredGames = data.allGame.nodes.filter((game) =>
        game.name.toLowerCase().includes(searchInput)
      );
      setSuggestions(filteredGames);
    } else {
      setSuggestions([]);
    }
  }, [input, data.allGame.nodes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    navigate(`/game/${slug}`);
    setInput("");
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const game = suggestions.find(
      (g) => g.name.toLowerCase() === input.toLowerCase()
    );
    if (game) {
      navigate(`/game/${game.slug}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // This function triggers the search
    }
  };

  return (
    <div className={styles.searchBarContainer} ref={ref}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search games..."
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        🔍
      </button>
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((game) => (
            <li key={game.slug} onClick={() => handleSelect(game.slug)}>
              {game.name}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && input.length >= 3 && suggestions.length === 0 && (
        <div className={styles.noMatches}>No matches found</div>
      )}
    </div>
  );
};

export default SearchBar;
