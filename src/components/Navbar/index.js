import React, { Fragment, Component, PureComponent } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import axios from "axios";
import Spinner from "../common/Spinner";
import Logout from "./LogoutLink";

import UserToolbar from "./UserToolbar";

class Navbar extends Component {
  state = { online: false };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { session, location } = this.props;
    const { online } = this.state;
    if (session) {
      if (nextProps.session === undefined) {
        return true;
      }
      if (
        session.currentuser.username !==
          nextProps.session.currentuser.username ||
        session.currentuser.userID !== nextProps.session.currentuser.userID ||
        session.currentuser.profilePic !==
          nextProps.session.currentuser.profilePic
      ) {
        return true;
      }
    }
    if (
      location.pathname !== nextProps.location.pathname ||
      online !== nextState.online ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { session, history, t, tReady } = this.props;
    if (!tReady) {
      return <Spinner />;
    }
    return (
      <Fragment>
        {session && session.currentuser ? (
          <NavbarAuth session={session} t={t} history={history} />
        ) : (
          history.push("/")
        )}
      </Fragment>
    );
  }
}

class NavbarAuth extends PureComponent {
  state = {
    mobileMenu: false
  };

  toggleMobileMenu = () => {
    this.setState({ mobileMenu: !this.state.mobileMenu });
  };
  componentDidMount() {
    //I don't know why but we need both for it to work
    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_PROD_API_URL +
              "/offline?token=" +
              localStorage.getItem("token")
          : "http://localhost:4444/offline?token=" +
              localStorage.getItem("token")
      );
    });
    window.addEventListener("unload", this.logData, false);
  }
  logData = () => {
    axios.get(
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_PROD_API_URL +
            "/offline?token=" +
            localStorage.getItem("token")
        : "http://localhost:4444/offline?token=" + localStorage.getItem("token")
    );
  };
  render() {
    let href = window.location.href.split("/");
    href = href[3];
    const { session, t, history } = this.props;
    const { mobileMenu } = this.state;

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
                    onClick={() => this.toggleMobileMenu()}
                  >
                    <span className="hamburger-inner" />
                  </span>
                </div>
              </div>
              <div
                className={
                  mobileMenu === true ? "mobile-toggle show" : "mobile-toggle"
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
                    <span
                      onClick={() => {
                        history.push("/inbox");
                        this.toggleMobileMenu();
                      }}
                    >
                      {t("common:Inbox")}
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={() => {
                        history.push("/settings");
                        this.toggleMobileMenu();
                      }}
                    >
                      {t("common:myaccount")}
                    </span>
                  </li>
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
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("common")(withRouter(Navbar));
