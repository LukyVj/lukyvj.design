import React, { Component } from "react"

import Layout from "../layout/Layout"
import SEO from "../components/seo"
import Search from "../components/Search"
import "../styles/fragments.css"

class IndexPage extends Component {
  componentDidMount() {
    // console.log(process.env)
  }
  render() {
    return (
      <Layout>
        <SEO title="Home" />
        <Search />
      </Layout>
    )
  }
}

export default IndexPage
