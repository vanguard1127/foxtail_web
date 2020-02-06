import React, { PureComponent } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_COUNTS, NEW_INBOX_SUB_COUNT, NEW_NOTICE_SUB } from "../../queries";
import { Query } from "react-apollo";
import { NavLink } from "react-router-dom";
import UserToolbar from "./UserToolbar";
import * as ErrorHandler from "../common/ErrorHandler";
import Logout from "./LogoutLink";
import deleteFromCache from "../../utils/deleteFromCache";
import { withApollo } from "react-apollo";
import msgSound from "../../assets/audio/msg.mp3";
var msgAudio = new Audio(msgSound);
class NavbarAuth extends PureComponent {
  unsubscribe;
  unsubscribe2;
  state = {
    mobileMenu: false,
    blinkInbox: false
  };

  toggleMobileMenu = () => {
    if (this.mounted) {
      this.setState({ mobileMenu: !this.state.mobileMenu }, () => {
        if (this.state.mobileMenu) {
          document.body.classList.add("menu-shown");
        } else {
          document.body.classList.remove("menu-shown");
        }
      });
    }
  };

  toggleBlink = () => {
    if (this.mounted) {
      this.setState({ blinkInbox: !this.state.blinkInbox });
    }
  };

  componentDidMount() {
    this.mounted = true;
  }

  UNSAFE_componentWillMount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribe2) {
      this.unsubscribe2();
    }
  }

  openInbox = () => {
    const { cache } = this.props.client;
    deleteFromCache({ cache, query: "getInbox" });

    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });

    let newCounts = { ...getCounts };

    newCounts.newMsg = false;

    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts: { ...newCounts }
      }
    });
    this.props.history.push("/inbox");
    this.toggleMobileMenu();
  };

  render() {
    let href = window.location.href.split("/");
    href = href[3];

    const { session, t, history } = this.props;
    const { mobileMenu } = this.state;
    const isBlack = session.currentuser.blackMember.active ? true : false;
    const isCouple =
      session.currentuser.coupleProfileName !== null ? true : false;

    return (
      <Query query={GET_COUNTS} fetchPolicy="cache-first">
        {({ data, loading, error, refetch, subscribeToMore }) => {
          if (loading || !data) {
            return (
              <div className="function">
                <CircularProgress size={30} color="secondary" />
              </div>
            );
          }

          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getCounts"}
                userID={session.currentuser.userID}
              />
            );
          }

          if (!this.unsubscribe) {
            this.unsubscribe = subscribeToMore({
              document: NEW_INBOX_SUB_COUNT,
              updateQuery: (prev, { subscriptionData }) => {
                const { newInboxMsgSubscribe } = subscriptionData.data;

                //if chat itself is open dont add
                if (
                  !newInboxMsgSubscribe ||
                  newInboxMsgSubscribe.fromUser.id ===
                    this.props.session.currentuser.userID
                ) {
                  return prev;
                }

                if (
                  sessionStorage.getItem("page") === "inbox" &&
                  sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
                ) {
                  return;
                }

                let newCount = { ...prev.getCounts };
                console.log("new", newInboxMsgSubscribe);
                if (newInboxMsgSubscribe.type === "new") {
                  newCount.newMsg = true;
                } else {
                  newCount.msgsCount += 1;
                }
                console.log("count", newCount.msgsCount);
                msgAudio.play();
                return { getCounts: newCount };
              }
            });
          }

          if (!this.unsubscribe2) {
            this.unsubscribe2 = subscribeToMore({
              document: NEW_NOTICE_SUB,
              updateQuery: (prev, { subscriptionData }) => {
                const { newNoticeSubscribe } = subscriptionData.data;
                if (!newNoticeSubscribe) {
                  return prev;
                }

                const newCount = { ...prev.getCounts };
                newCount.noticesCount += 1;
                msgAudio.play();
                return { getCounts: newCount };
              }
            });
          }

          let count = null;
          if (
            data.getCounts.msgsCount &&
            data.getCounts.msgsCount > 0 &&
            !mobileMenu
          ) {
            count = <span className="count">{data.getCounts.msgsCount}</span>;
          }
          const newMsg = data.getCounts.newMsg;

          return (
            <div className="container">
              <div className="col-md-12">
                <div className="row no-gutters">
                  <div className="mobile">
                    <div className="mobile-menu">
                      <div
                        className={
                          mobileMenu === true
                            ? "hamburger hamburger--spring is-active"
                            : "hamburger hamburger--spring"
                        }
                      >
                        <span
                          className="hamburger-box"
                          onClick={this.toggleMobileMenu}
                        >
                          <span className="hamburger-inner" />
                          {count}
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        mobileMenu === true
                          ? "mobile-toggle show"
                          : "mobile-toggle"
                      }
                    >
                      <ul>
                        <li>
                          <span
                            onClick={() => {
                              history.push("/members");
                              this.toggleMobileMenu();
                            }}
                          >
                            {t("meetmembers")}
                          </span>
                        </li>
                        <li>
                          {" "}
                          <span
                            onClick={() => {
                              history.push("/events");
                              this.toggleMobileMenu();
                            }}
                          >
                            {t("goevents")}
                          </span>
                        </li>
                        <li>
                          <span onClick={this.openInbox}>
                            <div className="inbox">
                              {t("common:Inbox")}
                              {data.getCounts.msgsCount > 0 && (
                                <span className="count">
                                  {data.getCounts.msgsCount}
                                </span>
                              )}
                            </div>
                          </span>
                        </li>
                        <li>
                          <span
                            onClick={() => {
                              history.push("/settings");
                              this.toggleMobileMenu();
                            }}
                          >
                            {isCouple
                              ? t("common:ouracct")
                              : t("common:myaccount")}
                          </span>
                        </li>
                        {history.location.pathname !== "/settings" && (
                          <>
                            {!isCouple && (
                              <li>
                                <span
                                  onClick={() => {
                                    history.push({
                                      pathname: "/settings",
                                      state: { showCplMdl: true }
                                    });
                                    this.toggleMobileMenu();
                                  }}
                                >
                                  {t("common:addcoup")}
                                </span>
                              </li>
                            )}
                            {!isBlack && (
                              <li>
                                <span
                                  onClick={() => {
                                    history.push({
                                      pathname: "/settings",
                                      state: { showBlkMdl: true }
                                    });
                                    this.toggleMobileMenu();
                                  }}
                                  className="highlightTxt"
                                >
                                  {t("common:becomeblk")}
                                </span>
                              </li>
                            )}
                          </>
                        )}
                        <li>
                          <span>
                            <Logout t={t} />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-5 hidden-mobile">
                    <ul className="menu">
                      <li className={href === "members" ? "active" : ""}>
                        <NavLink to="/members">
                          <span role="heading" aria-level="1">
                            {t("meetmembers")}
                          </span>
                        </NavLink>
                      </li>
                      <li className={href === "events" ? "active" : ""}>
                        <NavLink to="/events">
                          {" "}
                          <span role="heading" aria-level="1">
                            {t("goevents")}
                          </span>
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-2 col-12">
                    <div
                      onClick={() => {
                        history.push("/members");
                      }}
                      className={mobileMenu === true ? "logo white" : "logo"}
                    >
                      <span />
                    </div>
                  </div>
                  <div className="col-md-5 flexible">
                    {session && session.currentuser && (
                      <UserToolbar
                        currentuser={session.currentuser}
                        href={href}
                        t={t}
                        ErrorHandler={ErrorHandler}
                        refetch={refetch}
                        counts={data.getCounts}
                        msgAudio={msgAudio}
                        blinkInbox={newMsg}
                        history={history}
                        dayjs={this.props.dayjs}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default withApollo(NavbarAuth);
