import React, { PureComponent } from "react";
import Signup from "./Signup";
import LoginButton from "./LoginButton";
import withAuth from "../HOCs/withAuth";
import LanguageControl from "../common/LanguageControl/LanguageControl";
import * as ErrorHandler from "../common/ErrorHandler";
import CountUp from "react-countup";
import { withApollo, Query } from "react-apollo";
import { CONFIRM_EMAIL, GET_DEMO_COUNTS } from "../../queries";
import ResetPhoneModal from "../Modals/ResetPhone";
import ContactUsModal from "../Modals/ContactUs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { withTranslation } from "react-i18next";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);

class Landing extends PureComponent {
  state = {
    resetPhoneVisible: false,
    token: null,
    tooltip: false,
    showContactModal: false
  };

  componentDidMount() {
    document.title = "Foxtail";
  }

  toggleContactModal = () => {
    this.setState({ showContactModal: !this.state.showContactModal });
  };

  render() {
    const { t, client, location, history, session, ReactGA } = this.props;
    const { resetPhoneVisible, token, tooltip, showContactModal } = this.state;
    let refer = null;
    let aff = null;
    let mem = null;
    let eve = null;

    if (location) {
      const params = new URLSearchParams(location.search);
      refer = params.get("refer");
      aff = params.get("aff");
      mem = params.get("mem");
      eve = params.get("eve");

      if (location.state) {
        if (location.state.type === "emailVer") {
          client
            .query({
              query: CONFIRM_EMAIL,
              variables: { token: location.state.token }
            })
            .then(resp => {
              if (resp.data.confirmEmail) {
                if (!toast.isActive("emailVer")) {
                  toast.success(t("emailconfirmed"), {
                    position: toast.POSITION.TOP_CENTER,
                    toastId: "emailVer"
                  });

                  history.replace({ state: {} });
                }
              } else {
                if (!toast.isActive("errVer")) {
                  toast.error(t("emailconffail"), {
                    position: toast.POSITION.TOP_CENTER,
                    toastId: "errVer",
                    autoClose: 8000
                  });

                  history.replace({ state: {} });
                }
              }
            });
        } else if (location.state.type === "phoneReset") {
          if (location.state.token) {
            this.setState({
              resetPhoneVisible: true,
              token: location.state.token
            });
            history.replace({ state: {} });
          } else {
            if (!toast.isActive("errVer")) {
              toast.error(t("phonefail"), {
                position: toast.POSITION.TOP_CENTER,
                toastId: "errVer"
              });
              history.replace({ state: {} });
            }
          }
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
                        history={history}
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                        ReactGA={ReactGA}
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

                      <Query query={GET_DEMO_COUNTS} fetchPolicy="cache-first">
                        {({ data, loading, error }) => {
                          if (error) {
                            console.error(error);
                          }
                          if (loading && !data) {
                            return null;
                          }
                          let malesNum = 0,
                            femalesNum = 0,
                            couplesNum = 0;

                          if (!loading && data && data.getDemoCounts) {
                            malesNum = data.getDemoCounts.malesNum;
                            femalesNum = data.getDemoCounts.femalesNum;
                            couplesNum = data.getDemoCounts.couplesNum;
                          }
                          if (malesNum === 0) {
                            return null;
                          }
                          return (
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
                                        end={malesNum}
                                        duration={1.75}
                                        separator=","
                                      />
                                    </span>
                                    <span>{t("Male Members")}</span>
                                  </li>
                                  <li>
                                    <span className="counter">
                                      {" "}
                                      <CountUp
                                        end={femalesNum}
                                        duration={1.75}
                                        separator=","
                                      />
                                    </span>
                                    <span>{t("Female Members")}</span>
                                  </li>
                                  <li>
                                    <span className="counter">
                                      {" "}
                                      <CountUp
                                        end={couplesNum}
                                        duration={1.75}
                                        separator=","
                                      />
                                    </span>
                                    <span>{t("Couple Profiles")}</span>
                                  </li>
                                </ul>
                              </ErrorHandler.ErrorBoundary>
                            </div>
                          );
                        }}
                      </Query>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12">
                    <ErrorHandler.ErrorBoundary>
                      <Signup
                        t={t}
                        ErrorHandler={ErrorHandler}
                        lang={lang}
                        refer={refer}
                        aff={aff}
                        mem={mem}
                        eve={eve}
                        toast={toast}
                        session={session}
                        history={history}
                        ReactGA={ReactGA}
                      />
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
                    Foxtail © 2019 {t("Created by")} <span>Foxtail</span>
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
                              <span onClick={() => history.push("/tos")}>
                                {t("common:Terms")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span onClick={() => history.push("/privacy")}>
                                {t("common:Privacy")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span onClick={() => history.push("/antispam")}>
                                {t("antispam")}
                              </span>
                            </div>
                            <div>
                              {" "}
                              <span
                                onClick={() => history.push("/lawenforcement")}
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
                        <span onClick={() => history.push("/faq")}>
                          {t("FAQ")}
                        </span>
                      </li>
                      <li>
                        <span onClick={() => history.push("/about")}>
                          {t("About")}
                        </span>
                      </li>
                      <li>
                        <span onClick={this.toggleContactModal}>
                          {t("contact")}
                        </span>
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
            close={() =>
              this.setState({ resetPhoneVisible: false, token: null })
            }
            ErrorHandler={ErrorHandler}
            history={history}
            lang={lang}
          />
        )}
        {showContactModal && (
          <ContactUsModal
            close={() => this.toggleContactModal()}
            guest={true}
            header={t("common:Send us a Message")}
            description={t("common:Questions/Comments/Suggestions/etc...")}
            okText={t("common:Send")}
          />
        )}
        <ToastContainer position="top-center" />
      </>
    );
  }
}

export default withApollo(
  withTranslation("landing")(
    withAuth(session => session && session.currentuser)(Landing)
  )
);
