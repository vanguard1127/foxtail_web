import React, { Component } from "react";
import Signup from "./Signup";
import LoginButton from "./LoginButton";
import LanguageControl from "../common/LanguageControl/LanguageControl";

import { withNamespaces } from "react-i18next";

class Landing extends Component {
  state = { lang: "en" };
  handleLangChange = value => {
    this.setState({ lang: value });
  };
  render() {
    const { t } = this.props;

    return (
      <div>
        <header className="landing">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <div className="logo">
                    <span />
                  </div>
                </div>
                <div className="offset-md-3 col-md-5">
                  <div className="content">
                    <LoginButton t={t} />
                    <LanguageControl onChange={this.handleLangChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="landing">
            <div className="container">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-lg-7 col-md-12">
                    <div className="left">
                      <div className="welcome-text">
                        <h1>{t("title")}</h1>
                        <span className="title">{t("subtitle")}</span>
                      </div>
                      <div className="stats">
                        <div className="head">
                          <span> {t("Welcome")}</span>{" "}
                          <span> {t("Foxtail Stats")}</span>
                        </div>
                        <ul>
                          <li>
                            <span className="counter">19.528</span>
                            <span>{t("Male Members")}</span>
                          </li>
                          <li>
                            <span className="counter">22.882</span>
                            <span>{t("Female Members")}</span>
                          </li>
                          <li>
                            <span className="counter">5823</span>
                            <span>{t("Couple Profiles")}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12">
                    <Signup t={t} lang={this.state.lang} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4">
                  <span className="created">
                    Foxtail © 2018 {t("Created by")} <span>Foxtail</span>
                  </span>
                </div>
                <div className="offset-md-2 col-md-6">
                  <div className="links">
                    <ul>
                      <li>
                        <span>{t("common:Terms")}</span>
                      </li>
                      <li>
                        <span>{t("common:Privacy")}</span>
                      </li>
                      <li>
                        <span>{t("FAQ")}</span>
                      </li>
                      <li>
                        <span>{t("About")}</span>
                      </li>
                      <li>
                        <span>{t("Support")}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default withNamespaces("landing")(Landing);
