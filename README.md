# RankedByGamers

RankedByGamers is a responsive Jamstack website built using Gatsby, a React framework. The site utilizes the Internet Game Database (IGDB) to showcase the top-rated games to date, filtered by genre and locale. The project demonstrates key concepts in Jamstack, React, responsive design, continuous integration and continuous deployment (CI/CD), and is being hosted on Netlify.


## Hosted URL

Visit the website here: https://rankedbygamers.netlify.app


## Features

- **Homepage**: 
1. A call-to-action button that links to the genres page.
2. A "featured game" card that dynamically recommends a game based on the user's locale and that links to the game's page.
3. An "all games in your language" button that links user locale to a games-in-language page using both base-matching (e.g., "en") and exact-matching (e.g., "en-US") of locale.
4. A subscription form with front-end validation that allows users to subscribe to a newsletter via Netlify Forms.
5. A search bar that dynamically matches for games with a dropdown list as the user types.
- **About Page**: Some background for the website.
- **Genres Page**: A list of genres, each displayed with the number of top-rated games that it contains.
- **Genre Pages (for each genre)**: A list of games in a selected genre, sorted by ratings.
- **Games-in-Language Pages (for each language)**: A list of games that support the user's browser/preferred language.
- **Game Pages (for each game)**: Details for a selected game, including its cover, rating, developers, platforms, supported languages, description, and screenshots.