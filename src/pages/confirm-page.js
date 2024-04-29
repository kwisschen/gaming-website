import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ConfirmPage = () => (
  <Layout>
    <h1>Thank You!</h1>
    <p>Your subscription has been successfully received.</p>
  </Layout>
)

export const Head = () => <Seo title="Thank You" />

export default ConfirmPage
