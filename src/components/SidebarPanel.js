/** @jsx jsx */
import { React, Component } from "react"
import { css, jsx } from "@emotion/core"
import { isBrowser } from "../scripts/helpers"
import * as Icon from "react-feather"

class SidebarPanel extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className="pos-fixed w-100p h-100p z-max d-grid g-6 tesssst us-none pe-none"
        css={css`
          z-index: 9999999;
          top: 0;
          left: 0;
        `}
      >
        {/* <div
          className={`bgc-white color-black pos-absolute w-100p ${
            this.props.parent.state.informationPanelShown
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
          className={`bgc-white color-black pos-absolute w-100p top-200 gcstart-0 md:gcend-2 us-text pe-auto ${
            this.props.parent.state.favedPanelShown
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
              <h5 className="ta-left d-grid g-3 w-100p ta-center bdbw-2 bdbs-solid bdc-blackx ov-hidden ws-nowrap to-ellipsis color-current fw-extrabold tt-upper fsz-14 mb-0">
                <span
                  className="gcstart-1 gcend-3 d-block h-50 d-flex ai-center jc-center bdrw-1 bdrs-solid bdc-black"
                  dangerouslySetInnerHTML={{
                    __html: `You saved ${
                      JSON.parse(window.localStorage.getItem("favorites"))
                        .length
                    } link${
                      JSON.parse(window.localStorage.getItem("favorites"))
                        .length <= 1
                        ? ""
                        : "s"
                    }`,
                  }}
                />
                <button
                  className="app-none bdw-0 gcstart-3 gcend-4 d-block h-50 d-flex ai-center jc-center bdlw-1 bdls-solid bdc-current cursor-pointer "
                  css={
                    this.props.parent.state.deleteFavMessage !== null &&
                    css`
                      background: repeating-linear-gradient(
                        -55deg,
                        rgba(205, 45, 14, 1),
                        rgba(205, 45, 14, 1) 5px,
                        rgba(232, 65, 24, 1) 5px,
                        rgba(232, 65, 24, 1) 10px
                      );

                      svg {
                        fill: ${this.props.parent.state.deleteFavMessage !==
                          null && "red"};
                        stroke: ${this.props.parent.state.deleteFavMessage !==
                          null && "white"};
                      }
                      &:hover {
                        background: repeating-linear-gradient(
                          -55deg,
                          rgba(205, 45, 14, 1),
                          rgba(205, 45, 14, 1) 5px,
                          rgba(232, 65, 24, 1) 5px,
                          rgba(232, 65, 24, 1) 10px
                        );
                        svg {
                          fill: red;
                          stroke: white;
                        }
                      }
                    `
                  }
                  onClick={() =>
                    this.props.parent.setState({
                      deleteFavMessage:
                        "Are you sure you want to delete all your favorite? You wont be able to recover them after that",
                    })
                  }
                >
                  <Icon.Trash
                    className="va-middle ml-8 pos-relative"
                    css={css`
                      top: -1px;
                    `}
                    width={16}
                    strokeWidth={3}
                    stroke={
                      this.props.parent.state.deleteFavMessage !== null
                        ? "red"
                        : "black"
                    }
                  />
                </button>
              </h5>

              <span>
                {this.props.parent.state.deleteFavMessage && (
                  <div className="bdbw-2 bdbs-solid bdc-black">
                    <p
                      className="p-8 fw-bold m-0"
                      css={css`
                        background: repeating-linear-gradient(
                          -55deg,
                          rgba(205, 45, 14, 1),
                          rgba(205, 45, 14, 1) 5px,
                          rgba(232, 65, 24, 1) 5px,
                          rgba(232, 65, 24, 1) 10px
                        );
                        color: white;
                      `}
                    >
                      <span role="img" aria-label="warning emoji">
                        ⚠️
                      </span>
                      {this.props.parent.state.deleteFavMessage}
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
                            background: repeating-linear-gradient(
                              -55deg,
                              rgba(205, 45, 14, 1),
                              rgba(205, 45, 14, 1) 5px,
                              rgba(232, 65, 24, 1) 5px,
                              rgba(232, 65, 24, 1) 10px
                            );
                            color: white;
                          }
                        `}
                      >
                        DELETE
                      </span>

                      <span
                        onClick={() => {
                          this.props.parent.setState({
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
                <h3>
                  Oopsie{" "}
                  <span role="img" aria-label="sad emoji">
                    😢
                  </span>
                </h3>
                <p className="op-50p">
                  Seems like you haven't saved anything yet in your favorite
                </p>
              </div>
            </div>
          )}
        </div> */}
      </div>
    )
  }
}

export default SidebarPanel
