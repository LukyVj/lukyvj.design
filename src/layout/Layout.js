/** @jsx jsx */

import React from "react"
import Helmet from "react-helmet"
import PropTypes from "prop-types"
import { css, jsx } from "@emotion/core"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./Header"
import "../styles/layout.css"
import Footer from "./Footer"

const Layout = ({ children }) => {
  const HFSize = 100
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Helmet
        htmlAttributes={{
          class: "w-100vw h-100vh ov-hidden",
        }}
        bodyAttributes={{
          class: "w-100vw h-100vh  ff-sans-serif ",
        }}
      />
      <div>
        <Header siteTitle={data.site.siteMetadata.title} size={HFSize} />

        <main
          className={`mt-50 md:mt-${HFSize} w-100p bdrw-2 bdlw-2 bdls-solid bdrs-solid bdc-black`}
          css={css`
            background: white
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHklEQVQYV2NkYGAwZmBgOMsAAcaMMAaUPotVAEULAIpFBGuHZPV9AAAAAElFTkSuQmCC);
            height: calc(100vh - 50px);

            @media (min-width: 960px) {
              height: calc(100vh - ${HFSize * 2}px);
            }
          `}
        >
          {children}
        </main>

        <Footer size={HFSize} />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
