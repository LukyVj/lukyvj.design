/** @jsx jsx */
import { Component, useState } from "react"
import algoliasearch from "algoliasearch/lite"
import {
  InstantSearch,
  connectSearchBox,
  connectRefinementList,
  connectHits,
  connectHighlight,
} from "react-instantsearch-dom"
import { css, jsx } from "@emotion/core"
import * as Icon from "react-feather"
import { isBrowser } from "../scripts/helpers"

import "../styles/search.css"
import { set } from "idb-keyval"

const searchClient = algoliasearch(
  process.env.ALG_APP_ID,
  process.env.ALG_API_KEY
)

const CustomHighlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  })

  return (
    <span>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <span
            key={index}
            css={css`
              font-style: normal;
              border-radius: 1em 0 1em 0;
              text-shadow: 1px 1px 1px #fff;
              background-image: linear-gradient(
                -100deg,
                rgba(255, 250, 150, 0.55),
                rgba(255, 250, 150, 1) 100%,
                rgba(255, 250, 150, 0.85)
              );
            `}
          >
            {part.value}
          </span>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  )
}

class CustomRefinementList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowingMore: false,
    }
  }

  onToggleShowMore = () => {
    this.setState({ isShowingMore: !this.state.isShowingMore })
  }

  render() {
    const {
      refine,
      items,
      searchForItems,
      limit,
      showMore,
      showMoreLimit,
      openFacet,
    } = this.props

    const { isShowingMore } = this.state

    const elements = items
      .slice(0, showMore && isShowingMore ? showMoreLimit : limit)
      .map((item, index) => (
        <div
          key={index}
          className={`h-50 bdbw-2 bdbs-solid pos-relative bdc-${
            item.isRefined ? "white" : "black"
          } color-${item.isRefined ? "white" : "black"} bgc-${
            item.isRefined ? "black" : "white"
          }`}
        >
          <button
            onClick={e => {
              e.preventDefault()
              refine(item.value)
            }}
            className="d-inline-block w-100p app-none bgc-transparent bdw-0 h-100p d-flex ai-center jc-center cursor-pointer color-current"
            css={css`
              outline: none;
            `}
          >
            <span className="ta-left d-block w-90p ov-hidden ws-nowrap to-ellipsis color-current fw-extrabold tt-upper fsz-14">
              {item.isRefined && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  class="feather feather-x va-middle mr-8"
                  width="16"
                  height="16"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}{" "}
              {item.label.includes("https://")
                ? item.label.replace("https://", "")
                : item.label.includes("http://")
                ? item.label.replace("http:", "")
                : item.label}
            </span>
            <span className="fw-bold color-current">{item.count}</span>
          </button>
        </div>
      ))
    const searchForFacetValues = (
      <div>
        <input
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          required
          maxLength="512"
          placeholder="Search for more.."
          className="w-100p pv-8 bdw-0 bdbw-1 bds-solid bdc-proton bgc-transparent mv-8"
          onChange={event => searchForItems(event.target.value)}
        />
      </div>
    )
    return (
      <div>
        {openFacet && searchForFacetValues}
        <div className="d-flex fxd-column">{elements}</div>
        {showMore ? (
          <div className="h-50 bdbw-2 bdbs-solid pos-relative bdc-black color-black bgc-white">
            <button
              className="d-inline-block w-100p app-none bgc-transparent bdw-0 h-100p d-flex ai-center jc-center cursor-pointer color-current"
              css={css`
                outline: none;
              `}
              onClick={this.onToggleShowMore}
            >
              {isShowingMore ? (
                <span className="va-middle">
                  Show less
                  <Icon.Minus
                    width={16}
                    strokeWidth={3}
                    className="feather feather-x va-middle ml-8"
                  />
                </span>
              ) : (
                <span className="va-middle">
                  Show more
                  <Icon.Plus
                    width={16}
                    strokeWidth={3}
                    className="feather feather-x va-middle ml-8"
                  />
                </span>
              )}
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}

class CustomSearchBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      updated: false,
      favedPanelShown: false,
      informationPanelShown: false,
    }
  }

  handleFavPanelClick = () => {
    this.setState({
      favedPanelShown: !this.state.favedPanelShown,
      informationPanelShown: false,
    })
  }

  handleInfoPanelClick = () => {
    this.setState({
      informationPanelShown: !this.state.informationPanelShown,
      favedPanelShown: false,
    })
  }

  componentDidMount() {
    this.setState({ updated: true })
  }

  render() {
    const { currentRefinement, refine } = this.props

    return (
      <div>
        <form
          noValidate
          action=""
          role="search"
          className="pos-relative d-flex ai-center jc-center mb-0 d-grid g-6"
        >
          <div className="bgc-white gcstart-1 gcend-2 d-grid g-3 ta-center h-100 bdrw-1 bdbw-2 bdrs-solid bdbs-solid">
            <button className="app-none bdw-0 bdc-black d-flex ai-center jc-center bdrw-2 bdrs-solid bgc-white color-black hover:bgc-black hover:color-white cursor-pointer">
              <Icon.Info
                onClick={e => {
                  e.preventDefault()
                  this.handleInfoPanelClick()
                }}
              />
            </button>
            <button
              className="app-none bdw-0 bdc-black d-flex ai-center jc-center bdrw-2 bdrs-solid bgc-white color-black hover:bgc-black hover:color-white cursor-pointer"
              onClick={e => {
                e.preventDefault()
                this.handleFavPanelClick()
                this.setState({
                  deleteFavMessage: null,
                })
              }}
            >
              <Icon.Star />
            </button>
            <button className="app-none bdw-0 bdc-black d-flex ai-center jc-center bgc-white color-black hover:bgc-black hover:color-white cursor-pointer">
              <Icon.Share />
            </button>
          </div>
          <input
            type="search"
            value={currentRefinement}
            onChange={event => refine(event.currentTarget.value)}
            className="app-none w-100p h-100 bdw-0 bdbw-2 bdbs-solid bdc-black ph-16 gcstart-2 gcend-6 bdlw-1 bdls-solid ff-mono"
            placeholder="Search my bookmarks! "
            css={css`
              font-size: 40px;
              outline: none;
            `}
          />

          <div className="gcstart-6 gcend-7 ta-center bgc-white d-flex ai-center jc-center bdbw-2 bdbs-solid bdc-black h-100">
            <Icon.Search width={56} height={56} strokeWidth={2.3} />
          </div>
        </form>
        <div
          className="pos-fixed w-100p h-100p z-max d-grid g-6 tesssst us-none pe-none"
          css={css`
            z-index: 9999999;
            top: 0;
            left: 0;
          `}
        >
          <div
            className={`bgc-white color-black pos-absolute w-100p ${
              this.state.informationPanelShown
                ? "d-block v-visible"
                : "d-none v-hidden"
            }`}
            css={css`
              z-index: 9999999999;
            `}
          >
            <p>My smart bookmark system</p>
            )}
          </div>
          <div
            className={`bgc-white color-black pos-absolute w-100p top-200 gcstart-0 md:gcend-2 ${
              this.state.favedPanelShown
                ? "d-block v-visible"
                : "d-none v-hidden"
            }`}
            css={css`
              z-index: 9999999999;
              height: calc(100% - 300px);
            `}
          >
            {isBrowser && window.localStorage.getItem("favorites") ? (
              <div>
                <h5 className="ta-left d-block w-100p p-16 ta-center bdbw-2 bdbs-solid bdc-blackx ov-hidden ws-nowrap to-ellipsis color-current fw-extrabold tt-upper fsz-14 mb-0">
                  <span>
                    {`You saved ${
                      JSON.parse(window.localStorage.getItem("favorites"))
                        .length
                    } link${
                      JSON.parse(window.localStorage.getItem("favorites"))
                        .length <= 1
                        ? ""
                        : "s"
                    }`}
                  </span>

                  <Icon.Trash
                    className="va-middle cursor-pointer ml-8 pos-relative"
                    css={css`
                      top: -1px;
                      &:hover {
                        stroke: red;
                      }
                    `}
                    width={16}
                    strokeWidth={3}
                    stroke={
                      this.state.deleteFavMessage !== null ? "red" : "black"
                    }
                    onClick={() =>
                      this.setState({
                        deleteFavMessage:
                          "Are you sure you want to delete all your favorite? You wont be able to recover them after that",
                      })
                    }
                  />
                </h5>

                <span>
                  {this.state.deleteFavMessage && (
                    <div className="bdbw-2 bdbs-solid bdc-black">
                      <p
                        className="p-8 fw-bold m-0"
                        css={css`
                          color: red;
                        `}
                      >
                        {this.state.deleteFavMessage}
                      </p>
                      <div className="d-grid g-2 bdtw-2 bdts-solid bdc-black h-50 ta-center">
                        <span
                          onClick={() => {
                            isBrowser && window.localStorage.clear()
                            this.forceUpdate()
                          }}
                          className="bdrw-2 bdrs-solid bdc-black d-flex ai-center jc-center fw-bold tt-upper cursor-pointer"
                          css={css`
                            &:hover {
                              color: red;
                            }
                          `}
                        >
                          DELETE
                        </span>

                        <span
                          onClick={() => {
                            this.setState({
                              deleteFavMessage: null,
                            })
                            this.forceUpdate()
                          }}
                          className="d-flex ai-center jc-center fw-bold tt-upper cursor-pointer"
                        >
                          CANCEL
                        </span>
                      </div>
                    </div>
                  )}
                </span>
                <div
                  css={css`
                    counter-reset: fav-counter;
                  `}
                >
                  {JSON.parse(window.localStorage.getItem("favorites"))
                    .reverse()
                    .map(faved => (
                      <div
                        className="pv-4 h-auto bdbw-2 bdbs-solid pos-relative bdc-black color-black bgc-white"
                        css={css`
                          counter-increment: fav-counter;
                        `}
                      >
                        <a
                          href={faved.link}
                          title={faved.link}
                          className="td-none w-100p color-current td-none d-inline-block va-bottom p-4"
                        >
                          <span
                            className="w-100p d-inline-block tt-upper lh-big fsz-12 fw-bold"
                            css={css`
                              ::before {
                                content: counter(fav-counter) ". ";
                              }
                            `}
                          >
                            {faved.title}
                          </span>
                          <small
                            className="w-100p d-inline-block ff-mono "
                            css={css`
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            `}
                          >
                            {faved.link}
                          </small>
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-16 ta-center h-100p d-flex ai-center jc-center">
                <div>
                  <h3>Oopsie 😢</h3>
                  <p className="op-50p">
                    Seems like you haven't saved anything yet in your favorite
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
class CustomHit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFaved: false,
      starBg: "black",
    }
  }

  addToFavorite = (arr, hit) => {
    if (isBrowser) {
      if (arr.includes(hit.link) === false) {
        arr.push({
          title: hit.title,
          link: hit.link,
          timestamp: performance.now(),
        })
      }

      if (!window.localStorage.getItem("favorites")) {
        window.localStorage.setItem("favorites", JSON.stringify([]))
      }

      if (
        JSON.parse(window.localStorage.getItem("favorites")).includes(
          hit.link
        ) === false
      ) {
        window.localStorage.setItem("favorites", JSON.stringify(arr))
      }

      console.log(window.localStorage.favorites)
    }
  }

  colorIfInFavorite = link => {
    const isIt =
      isBrowser && window.localStorage.getItem("favorites")
        ? window.localStorage.getItem("favorites").includes(link)
          ? true
          : false
        : false

    this.setState({ starBg: isIt ? "white" : "black" })
  }

  handleHitClick = (arr, hit) => {
    this.addToFavorite(arr, hit)
    this.setState({ starBg: "white" })
  }

  componentDidMount() {
    this.colorIfInFavorite(this.props.hit.link)
  }

  render() {
    const { updateRefinedTag } = this.props

    return (
      <div
        key={this.props.hit.objectID}
        className="pos-relative"
        css={css`
          background: white
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHklEQVQYV2NkYGAwZmBgOMsAAcaMMAaUPotVAEULAIpFBGuHZPV9AAAAAElFTkSuQmCC)
            repeat;
          &:before {
            content: "";
            display: block;
            width: 34px;
            height: 34px;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 100;
            background: rgb(0, 0, 0);
            background: linear-gradient(
              0.625turn,
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 1) 50%,
              transparent 50%,
              transparent 10%
            );
          }

          &:nth-of-type(5n) > div {
            border-right: 0;
          }
          &:nth-of-type(-n + 5) > div {
            border-top: 0;
          }
        `}
      >
        <div className="d-flex fxd-column h-100p bdw-1 bds-solid">
          <header className="bdbw-2 bdbs-solid bdc-black p-8 fx-none h-100 pos-relative bgc-white">
            <Icon.Star
              fill={this.state.starBg}
              stroke="white"
              width={13}
              height={13}
              className="cursor-pointer pos-absolute top-0 right-0 m-2"
              css={css`
                z-index: 999999;
              `}
              onClick={() =>
                this.handleHitClick(this.props.favorite, this.props.hit)
              }
            />
            <h4
              className="tt-upper lh-big"
              css={css`
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}
            >
              <Highlight hit={this.props.hit} attribute="title" />
            </h4>
          </header>

          <div
            className={`d-grid bgc-white g-${this.props.hit.tags.length} bdbw-2 bdbs-solid bdc-black`}
          >
            {this.props.hit.tags.map(tag => (
              <span
                className="bdrw-2 bdrs-solid bdc-black h-50 d-flex ai-center jc-center pv-8 fw-extrabold tt-upper fsz-10 bgc-white color-black hover:bgc-black hover:color-white cursor-pointer"
                css={css`
                  &:last-of-type {
                    border: none;
                  }
                `}
                onClick={() => updateRefinedTag(tag)}
              >
                <Icon.Tag
                  width={13}
                  height={13}
                  strokeWidth={3}
                  css={css`
                    margin-right: 4px;
                  `}
                />
                {tag}
              </span>
            ))}
          </div>
          {this.props.hit.description && (
            <div className="bdbw-2 bdbs-solid bdc-black p-8 fx-12 bgc-white">
              <p>
                <Highlight hit={this.props.hit} attribute="description" />
              </p>
            </div>
          )}
          {this.props.hit.comment && (
            <div className="bdbw-2 bdbs-solid bdc-black p-8 fsz-14 fx-12 ff-mono fw-semibold pv-8 lh-big bgc-white">
              <p className="p-0 m-0">
                <Icon.MessageSquare
                  width={12}
                  height={12}
                  className="d-inline va-middle mr-8"
                />
                <Highlight hit={this.props.hit} attribute="comment" />
              </p>
            </div>
          )}

          <footer
            className="pos-relative bdc-black color-black w-100p va-middle td-none fsz-12 fw-extrabold ff-mono fx-4 js-end bgc-white"
            css={css`
              flex: 0;
            `}
          >
            <a
              href={this.props.hit.link}
              title={`Link to: ${this.props.hit.title}`}
              rel="noopener"
              target="_blank"
              className="h-50 w-100p bdbw-2 bdbs-solid pos-relative bdc-black color-black hover:bgc-black hover:color-white d-inline-block w-100p d-flex ai-center jc-center  va-middle td-none tt-upper fw-extrabold fsz-16"
              css={css`
                & > .icon:nth-of-type(2) {
                  display: none;
                }
                &:hover {
                  .icon:nth-of-type(1) {
                    display: none;
                  }
                  .icon:nth-of-type(2) {
                    display: block;
                  }
                }
              `}
            >
              Visit link
              <Icon.ExternalLink
                width={15}
                strokeWidth={3}
                className="icon ml-8"
              />
              <Icon.Eye width={15} strokeWidth={3} className="icon ml-8" />
            </a>
            <div className="h-50 w-100p pos-relative">
              <div className="bdrw-1 bdrs-solid bdc-black pos-absolute left-0 top-0 w-50p d-flex ai-center h-100p p-8 ta-left">
                <a
                  href={this.props.hit.origin}
                  title={`${this.props.hit.origin}`}
                  className="w-100p color-current td-none"
                  css={css`
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                >
                  <Icon.Link2 width={16} className="va-middle mr-8 ml-4" />
                  {this.props.hit.origin.includes("https://")
                    ? this.props.hit.origin.replace("https://", "")
                    : this.props.hit.origin.includes("http://")
                    ? this.props.hit.origin.replace("http:", "")
                    : this.props.hit.origin}
                </a>
              </div>
              <div className="bdlw-1 bdls-solid bdc-black pos-absolute right-0 top-0 w-50p d-flex ai-center h-100p p-8 ta-left">
                <Icon.Calendar width={16} className="va-middle" />
                <Icon.ArrowDown width={16} className="va-middle mr-4" />
                <time>{this.props.hit.readableDate}</time>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}
class CustomHits extends Component {
  render() {
    const { hits, favorite } = this.props

    return (
      <div
        className="d-grid md:g-2 lg:g-4 xl:g-5 ovx-hidden"
        css={css`
          width: calc(100% + 2.5px);
        `}
      >
        {hits.map(hit => (
          <CustomHit hit={hit} favorite={favorite} />
        ))}
      </div>
    )
  }
}

const Hits = connectHits(CustomHits)
const SearchBox = connectSearchBox(CustomSearchBox)
const RefinementList = connectRefinementList(CustomRefinementList)
const Highlight = connectHighlight(CustomHighlight)

const Search = () => {
  const [tag, setTag] = useState(null)
  let favorite =
    isBrowser && window.localStorage.getItem("favorites")
      ? JSON.parse(window.localStorage.getItem("favorites"))
      : []

  return (
    <InstantSearch searchClient={searchClient} indexName="lukyvj_design_feed">
      <SearchBox className="app-none" />
      <section
        className="d-grid g-6"
        css={css`
          height: calc(100% - 100px);
        `}
      >
        <div className="h-100p w-100p bdrw-1 bdc-black bdrs-solid ov-auto d-none md:d-block">
          <RefinementList
            attribute="tags"
            limit={6}
            defaultRefinement={tag}
            showMore
          />
          <RefinementList
            attribute="origin"
            limit={6}
            defaultRefinement={tag}
            showMore
          />
        </div>

        <div
          className="gcstart-1 md:gcstart-2 gcend-7 h-100p w-100p ov-auto "
          css={css`
            background: white
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHklEQVQYV2NkYGAwZmBgOMsAAcaMMAaUPotVAEULAIpFBGuHZPV9AAAAAElFTkSuQmCC);
          `}
        >
          <Hits
            updateRefinedTag={tag => {
              setTag(tag)
            }}
            favorite={favorite}
          />
        </div>
      </section>
    </InstantSearch>
  )
}

export default Search
