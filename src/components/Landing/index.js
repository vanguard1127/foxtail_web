import React, { PureComponent } from "react";
import Signup from "./Signup";
import LoginButton from "./LoginButton";
import LanguageControl from "../common/LanguageControl/LanguageControl";
import * as ErrorHandler from "../common/ErrorHandler";
import CountUp from "react-countup";
import ResetPhoneModal from "../Modals/ResetPhone";
import { ToastContainer, toast } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
import "react-toastify/dist/ReactToastify.min.css";
import { withNamespaces } from "react-i18next";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);

class Landing extends PureComponent {
  state = { resetPhoneVisible: false, token: null, tooltip: false };

  componentDidMount() {
    document.title = "Foxtail";
  }

  render() {
    const { t, props } = this.props;
    const { resetPhoneVisible, token, tooltip } = this.state;
    if (props.location.state) {
      if (props.location.state.emailVer === true) {
        if (!toast.isActive("emailVer")) {
          toast.success(t("emailconfirmed"), {
            position: toast.POSITION.TOP_CENTER,
            toastId: "emailVer"
          });

          props.history.replace({ state: {} });
        }
      } else if (props.location.state.emailVer === false) {
        if (!toast.isActive("errVer")) {
          toast.error(t("emailconffail"), {
            position: toast.POSITION.TOP_CENTER,
            toastId: "errVer"
          });

          props.history.replace({ state: {} });
        }
      } else if (props.location.state.phoneReset === true) {
        this.setState({
          resetPhoneVisible: true,
          token: props.location.state.token
        });
        props.history.replace({ state: {} });
      } else if (props.location.state.phoneReset === false) {
        if (!toast.isActive("errVer")) {
          toast.error(t("phonefail"), {
            position: toast.POSITION.TOP_CENTER,
            toastId: "errVer"
          });

          props.history.replace({ state: {} });
        }
      }
    }
    return (
      <>
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
                    <ErrorHandler.ErrorBoundary>
                      <LoginButton
                        t={t}
                        history={props.history}
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                      />
                    </ErrorHandler.ErrorBoundary>
                    <ErrorHandler.ErrorBoundary>
                      {" "}
                      <LanguageControl lang={lang} />
                    </ErrorHandler.ErrorBoundary>
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
                        <ErrorHandler.ErrorBoundary>
                          <ul>
                            <li>
                              <span className="counter">
                                <CountUp
                                  end={19538}
                                  duration={1.75}
                                  separator="."
                                />
                              </span>
                              <span>{t("Male Members")}</span>
                            </li>
                            <li>
                              <span className="counter">
                                {" "}
                                <CountUp
                                  end={19538}
                                  duration={1.75}
                                  separator="."
                                />
                              </span>
                              <span>{t("Female Members")}</span>
                            </li>
                            <li>
                              <span className="counter">
                                {" "}
                                <CountUp
                                  end={19538}
                                  duration={1.75}
                                  separator="."
                                />
                              </span>
                              <span>{t("Couple Profiles")}</span>
                            </li>
                          </ul>
                        </ErrorHandler.ErrorBoundary>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12">
                    <ErrorHandler.ErrorBoundary>
                      {" "}
                      <Signup t={t} ErrorHandler={ErrorHandler} lang={lang} />
                    </ErrorHandler.ErrorBoundary>
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
                        <span
                          onClick={() => {
                            this.setState({
                              resetPhoneVisible: !resetPhoneVisible
                            });
                          }}
                        >
                          {t("resetphone")}
                        </span>
                      </li>
                      <li className="tooltip">
                        {tooltip && (
                          <span className="tooltiptext">
                            <div>
                              {" "}
                              <span
                                onClick={() =>
                                  this.props.props.history.push("/tos")
                                }
                              >
                                {t("common:Terms")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span
                                onClick={() =>
                                  this.props.props.history.push("/privacy")
                                }
                              >
                                {t("common:Privacy")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span
                                onClick={() =>
                                  this.props.props.history.push("/antispam")
                                }
                              >
                                {t("antispam")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span
                                onClick={() =>
                                  this.props.props.history.push(
                                    "/lawenforcement"
                                  )
                                }
                              >
                                {t("lawenf")}
                              </span>
                            </div>
                          </span>
                        )}
                        <span
                          onClick={() => this.setState({ tooltip: !tooltip })}
                        >
                          {t("common:Terms") + " "}
                          {tooltip ? "▽" : "△"}
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() => this.props.props.history.push("/faq")}
                        >
                          {t("FAQ")}
                        </span>
                      </li>
                      <li>
                        <span
                          onClick={() =>
                            this.props.props.history.push("/about")
                          }
                        >
                          {t("About")}
                        </span>
                      </li>
                      <li>
                        <a href="mailto:support@foxtail.com">{t("Support")}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {resetPhoneVisible && (
          <ResetPhoneModal
            t={t}
            token={token}
            close={() => this.setState({ resetPhoneVisible: false })}
            ErrorHandler={ErrorHandler}
            history={this.props.props.history}
            lang={lang}
          />
        )}
        <ToastContainer />
      </>
    );
  }
}

export default withNamespaces("landing")(Landing);
