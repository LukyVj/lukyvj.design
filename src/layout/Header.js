/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const Header = ({ siteTitle, size }) => (
  <header className={`pos-fixed top-0 z-max h-50 md:h-${size} w-100p`}>
    <div
      style={{
        margin: `0 auto`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link to="/" className="d-grid g-6 ta-center p-0 m-0 td-none">
          {"lukyvj".split("").map(letter => (
            <span
              className={`tt-upper fw-bold bdw-2 bds-solid bdc-black bdrw-0 d-block h-50 md:h-${size} d-flex ai-center jc-center color-black bgc-white fsz-18 md:fsz-auto`}
              key={letter}
              css={css`
                &:last-of-type {
                  border-right-width: 2px;
                }
              `}
            >
              {letter}
            </span>
          ))}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
