import React from "react"

import Layout from "../layout/Layout"
import SEO from "../components/seo"
import Search from "../components/Search"
import "../styles/fragments.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Search />
  </Layout>
)

export default IndexPage
