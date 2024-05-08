# RankedByGamers

RankedByGamers is a responsive Jamstack website built using Gatsby, a React framework. The site utilizes the Internet Game Database (IGDB) to showcase the top-rated games to date, filtered by genre and locale. The project demonstrates key concepts in Jamstack, React, and continuous integration and continuous deployment (CI/CD), employs ESLint and Jest tests, and is hosted on Netlify.


## Features

- **Homepage**: 
1. A call-to-action button that links to the genres page.
2. A "featured game" card that dynamically recommends a game based on the user's locale and links to the game's page.
3. An "all games in your language" button that links user locale to a games-in-language page using both base-matching (e.g., "en") and exact-matching (e.g., "en-US") of locale.
4. A subscription form with front-end validation that allows users to subscribe to a newsletter via Netlify Forms.
5. A search bar that dynamically matches for games with a dropdown list as the user types.
- **About Page**: Some background for the website.
- **Genres Page**: A list of genres, each displayed with the number of top-rated games it contains.
- **Genre Pages (for each genre)**: A list of games in a selected genre, sorted by ratings.
- **Games-in-Language Pages (for each language)**: A list of games that support the user's preferred/browser language.
- **Game Pages (for each game)**: Details for a selected game, including its cover, rating, platforms, supported languages, description, and screenshots.


## Hosted URL

Visit the website here: https://rankedbygamers.netlify.app


## Getting Started

### Prerequisites

Before running the project locally, ensure that you have the following installed:

- Node.js (version 14 or above)
- Gatsby CLI (globally installed)

### Installation

#### Step 1

Open terminal and install Gatsby:

- __'npm install -g gatsby-cli'__


#### Step 2

Clone the remote repository for this project:

- __'git clone https://github.com/cscie114/csci-e-114-final-project-kwisschen'__


#### Step 3

Head into the project directory:

- __'cd [path to project directory]'__


#### Step 4

Install project dependencies:

- __'npm install'__


#### Step 5

Obtain a free Client ID & Access Token from IGDB (requires a Twitch account):

- [IGDB API Docs - Getting Started](https://api-docs.igdb.com/?javascript#getting-started)

**Tip:** You'll only need to complete the "Account Creation" and "Authentication" steps to obtain the access token.


#### Step 6

Create a file named ".env" in the root directory of the project and put in:

- __IGDB_CLIENT_ID = [your Client ID here]__

- __IGDB_ACCESS_TOKEN = [your Access Token here]__

**Important:** Remember to add this .env file to your .gitignore file.


#### Step 7

Run the web application locally:

1. __'gatsby develop'__

2. Once complete, visit __http://localhost:8000/__

**Note:** Visit our live website [here](https://rankedbygamers.netlify.app) to enable successful form submission.


#### Step 8

Test the application locally:

1.  __'npm run lint'__

2.  __'npm run test'__

3. Try typing 'mario' into the search bar.

4. Change your preferred language in browser Settings (e.g., using "Move to the top") and refresh our Homepage to see links to different games-in-language pages.

**Note:** If a generic language that does not specify a country is selected as your preferred language, e.g., "Portuguese", there may be no video games that support said generic language, as video game languages are pretty specific. In this case, the site is programmed to default to providing a link to the games-in-language page of the first country in alphabetical order, e.g., "Portuguese (Brazil)" rather than "Portuguese (Portugal)". On the other hand, if a preferred language that is truly not supported by any game is selected, e.g., "Latin", the Homepage will hide the link to a language page and display the heading as "Featured Game" (chosen from all games rather than games in a specific language) instead of "Recommended For You:".


## Acknowledgements
Special thanks to the CSCI E-114 course team for the guidance and support.