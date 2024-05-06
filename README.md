# RankedByGamers - a gaming website developed in React using Gatsby

Site URL: https://rankedbygamers.netlify.app/


# Content Below To Be Updated

## Introduction
Game Grapes is a Gatsby project built (almost) from scratch in CSCI E-114. Utilizing the Internet Game Database (IGDB) from Amazon's Twitch, Game Grapes provides information on the top 500 rated games of all time, regardless of whether they've aged into fine wine, as sorted by genre. This website runs ESLint and Jest tests, and implements CI/CD with GitHub Actions, Netlify Actions, as well as Netlify for deployment and hosting.

The homepage provides a Call-to-Action button which links to a genres page, the genres page contains a list of genre links each including the number of top 500 games falling under that genre and linking to individual genre pages, each individual genre page contains a list of game links beside which each rating is shown, and finally, clicking into each of these game links will yield an individual game page displaying the cover of that game, the rating, and a brief description of the game.

The homepage also includes a "featured game" card that will eventually take the user directly to a random game page when clicked (not yet implemented).

Lastly, at the bottom of the homepage is a newsletter subscription feature that leverages Netlify Forms, enabling users to sign up for our action-packed newsletters.

__Visit our website here:__ https://gamegrapes.netlify.app/



## How to run the website in 9 simple steps:

### Step 1

Open terminal and install Gatsby:

__'npm install -g gatsby-cli'__


### Step 2

Clone the remote repository for this project:

__'git clone https://github.com/cscie114/assignment-5-cicd-kwisschen.git'__


### Step 3

Head into the project directory:

__'cd [path to project directory]'__


### Step 4

Install project dependencies:

__'npm install'__


### Step 5

Obtain a free Client ID & Access Token from IGDB (requires a Twitch account):

[IGDB API Docs - Getting Started](https://api-docs.igdb.com/?javascript#getting-started)

Note: you'll only need to complete the "Account Creation" and "Authentication" steps to obtain the access token.


### Step 6

Create a file named ".env" at the root directory of the project and type in:

__IGDB_CLIENT_ID = [your Client ID here]__

__IGDB_ACCESS_TOKEN = [your Access Token here]__

Note: remember to add this file to your .gitignore file.


### Step 7

Run the application:

__'gatsby develop'__


### Step 8

Test the application locally:

__'npm run lint'__

__'npm run test'__

Note: you'll need to set up the .env secrets from Steps 5 & 6 in GitHub for building/testing/deploying via GitHub Actions.


### Step 9

Preview the website locally:

__http://localhost:8000/__

Note: signing up for our newsletter via Netlify Forms will require visiting our live website [here](https://gamegrapes.netlify.app/).