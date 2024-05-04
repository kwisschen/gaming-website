import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = () => {
  return (
    <Layout>
      <Seo title="About" />
      <div className="content">
        <h1>About RankedByGamers</h1>
        <p>Welcome to your ultimate guide to the gaming world!</p>
        <p>
          At RankedByGamers, we are passionate about gaming and strive to provide
          you with the latest information on the highest-rated games.
        </p>
        <p>
          Our mission is to help you discover new and exciting games to play,
          whether you&apos;re a seasoned gamer or just getting started.
        </p>
        <p>
          Explore our website to find ratings, descriptions, and more. Happy
          gaming!
        </p>
      </div>
    </Layout>
  )
}

export default AboutPage
