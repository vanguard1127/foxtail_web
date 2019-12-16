import React, { PureComponent } from "react";
import Signup from "./Signup";
import LoginButton from "./LoginButton";
import withAuth from "../HOCs/withAuth";
import * as ErrorHandler from "../common/ErrorHandler";
import ResetPhoneModal from "../Modals/ResetPhone";
import ResetPassModal from "../Modals/ResetPassword";
import ContactUsModal from "../Modals/ContactUs";
import Spinner from "../common/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { withTranslation } from "react-i18next";
import FooterLanding from "../Footer/FooterLanding";
import Header from "../Header";

class Landing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resetPhoneVisible: false,
      resetPassVisible: false,
      token: null,
      tooltip: false,
      showContactModal: false
    };
    this.resetPassClick = this.resetPassClick.bind(this);
    this.resetPhoneClick = this.resetPhoneClick.bind(this);
    this.termsClick = this.termsClick.bind(this);
    this.toggleContactModal = this.toggleContactModal.bind(this);
  }

  componentDidMount() {
    document.title = "Foxtail";
  }

  toggleContactModal = () => {
    this.setState({ showContactModal: !this.state.showContactModal });
  };
  resetPhoneClick() {
    this.setState({
      resetPhoneVisible: !this.state.resetPhoneVisible
    });
  }
  resetPassClick() {
    this.setState({
      resetPassVisible: !this.state.resetPassVisible
    });
  }
  termsClick() {
    this.setState({ tooltip: !this.state.tooltip });
  }
  render() {
    const { t, location, history, session, ReactGA, tReady, lang } = this.props;
    const {
      resetPhoneVisible,
      token,
      tooltip,
      showContactModal,
      resetPassVisible
    } = this.state;
    let refer = null;
    let aff = null;
    let mem = null;
    let eve = null;
    if (!tReady) {
      return <Spinner />;
    }
    if (location) {
      const params = new URLSearchParams(location.search);
      refer = params.get("refer");
      aff = params.get("aff");
      mem = params.get("mem");
      eve = params.get("eve");

      if (location.state && location.state.type === "phoneReset") {
        if (location.state.token) {
          this.setState({
            resetPhoneVisible: true,
            token: location.state.token
          });
        } else {
          if (!toast.isActive("errVer")) {
            toast.error(t("phonefail"), {
              position: toast.POSITION.TOP_CENTER,
              toastId: "errVer"
            });
          }
        }
      } else if (location.state && location.state.type === "passReset") {
        if (location.state.token) {
          this.setState({
            resetPassVisible: true,
            token: location.state.token
          });
        } else {
          if (!toast.isActive("errVer")) {
            toast.error(t("passfail"), {
              position: toast.POSITION.TOP_CENTER,
              toastId: "errVer"
            });
          }
        }
      }
    }
    return (
      <>
        <Header lang={lang} history={history} t={t} reactga={ReactGA} />
        <main>
          <section className="landing">
            <div className="container">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-lg-7 col-md-12">
                    <div className="left">
                      <div className="welcome-text">
                        <h1>
                          <span className="landing-header">
                            <span className="single-line">{t("free")}</span>
                            <span className="divider">|</span>
                            <span className="single-line">{t("private")}</span>
                            <span className="divider">|</span>
                            <span className="single-line">18+ {t("fun")}</span>
                          </span>
                        </h1>
                      </div>
                      <div className="mobile-login">
                        <ErrorHandler.ErrorBoundary>
                          <LoginButton
                            t={t}
                            history={history}
                            ErrorHandler={ErrorHandler}
                            lang={lang}
                            reactga={ReactGA}
                          />
                        </ErrorHandler.ErrorBoundary>
                      </div>
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
        <FooterLanding
          t={t}
          resetPassClick={this.resetPassClick}
          resetPhoneClick={this.resetPhoneClick}
          termsClick={this.termsClick}
          toggleContactModal={this.toggleContactModal}
          tooltip={tooltip}
        />
        {resetPassVisible && (
          <ResetPassModal
            t={t}
            token={token}
            close={() => {
              history.replace({ state: {} });
              this.setState({ resetPassVisible: false, token: null });
            }}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
        {resetPhoneVisible && (
          <ResetPhoneModal
            t={t}
            token={token}
            close={() => {
              history.replace({ state: {} });
              this.setState({ resetPhoneVisible: false, token: null });
            }}
            ErrorHandler={ErrorHandler}
            history={history}
            lang={lang}
            ReactGA={ReactGA}
          />
        )}
        {showContactModal && (
          <ContactUsModal
            close={this.toggleContactModal}
            guest={true}
            header={t("common:Send us a Message")}
            description={t("common:Questions/Comments/Suggestions/etc...")}
            okText={t("common:Send")}
          />
        )}
        <ToastContainer position="top-center" hideProgressBar={true} />
      </>
    );
  }
}

export default withTranslation("landing")(
  withAuth(session => session && session.currentuser)(Landing)
);
