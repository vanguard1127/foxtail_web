import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import { withNamespaces } from "react-i18next";
import { TOGGLE_ONLINE } from "../../queries";
import AccountKit from "react-facebook-account-kit";
import axios from "axios";

import UserToolbar from "./UserToolbar";

class Navbar extends Component {
  state = { online: false };

  handleToggle = (toggleOnline, online) => {
    this.setState({ online }, () => {
      toggleOnline()
        .then(async ({ data }) => {
          if (data.toggleOnline !== null) {
            await this.props.refetch();
          }
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  render() {
    const { session, history, t } = this.props;
    const { online } = this.state;

    return (
      <Fragment>
        {session && session.currentuser ? (
          <Mutation
            mutation={TOGGLE_ONLINE}
            variables={{
              online
            }}
          >
            {(toggleOnline, { data, loading, error }) => (
              <NavbarAuth
                session={session}
                toggleOnline={online => this.handleToggle(toggleOnline, online)}
                t={t}
              />
            )}
          </Mutation>
        ) : (
          history.push("/")
        )}
      </Fragment>
    );
  }
}

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  componentDidMount() {
    //TODO: Dont call if already online
    const { toggleOnline, t } = this.props;
    toggleOnline(true);

    //I don't know why but we need both
    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon(
        "http://localhost:4444/offline?token=" + localStorage.getItem("token")
      );
    });
    window.addEventListener("unload", this.logData, false);
  }
  logData = () => {
    axios.get(
      "http://localhost:4444/offline?token=" + localStorage.getItem("token")
    );
  };
  render() {
    let href = window.location.href.split("/");
    href = href[3];
    const { session, t } = this.props;
    return (
      <div className="container">
        <div className="col-md-12">
          <div className="row no-gutters">
            <div className="mobile">
              <div className="mobile-menu">
                <div className="hamburger hamburger--spring">
                  <span className="hamburger-box">
                    <span className="hamburger-inner" />
                  </span>
                </div>
              </div>
              <div className="mobile-toggle">
                <ul>
                  <li>
                    <NavLink to="/members">{t("Meet Members")}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/events">{t("Go to Events")}</NavLink>
                  </li>
                  <li>
                    <NavLink to="/inbox">{t("Inbox")}</NavLink>
                  </li>
                  <li>
                    <span>{t("Becoma a Black Member")}</span>
                  </li>
                  <li>
                    <span>{t("My Account")}</span>
                  </li>
                  <li>
                    <span>{t("Add Couple Partner")}</span>
                  </li>
                  <li>
                    <span>{t("Logout")}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 hidden-mobile">
              <ul className="menu">
                <li className={href === "members" ? "active" : ""}>
                  <NavLink to="/members">{t("Meet Members")}</NavLink>
                </li>
                <li className={href === "events" ? "active" : ""}>
                  <NavLink to="/events">{t("Go to Events")}</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-12">
              <div className="logo">
                <span />
              </div>
            </div>
            <div className="col-md-5 flexible">
              {session.currentuser && (
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

export default withNamespaces()(withRouter(Navbar));
