import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = () => {
  return (
    <Layout>
      <Seo title="About" />
      <div className="content">
        <h1>About Game Grapes</h1>
        <p>Welcome to Game Grapes, your ultimate guide to the gaming world!</p>
        <p>
          At Game Grapes, we are passionate about gaming and strive to provide
          you with information on the highest-rated games of all time.
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
