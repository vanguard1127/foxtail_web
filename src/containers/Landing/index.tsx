import React, { memo, useState, useEffect } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ReactGA from "react-ga";

import withAuth from "components/HOCs/withAuth";
import * as ErrorHandler from "components/common/ErrorHandler";
import ResetPhoneModal from "components/Modals/ResetPhone";
import ResetPassModal from "components/Modals/ResetPassword";
import ContactUsModal from "components/Modals/ContactUs";
import Spinner from "components/common/Spinner";
import FooterLanding from "components/Footer/FooterLanding";
import Header from "components/Header";
import LoginButton from "components/LoginButton";

import Signup from "./components/Signup";

import "react-toastify/dist/ReactToastify.min.css";

import "./styles.css";

interface ILandingProps extends WithTranslation, RouteComponentProps {
  lang: string;
}

const Landing: React.FC<ILandingProps> = memo(({
  t,
  location,
  history,
  tReady,
  lang,
}) => {
  const [resetPhoneVisible, setResetPhoneVisible] = useState<Boolean>(false);
  const [resetPassVisible, setResetPassVisible] = useState<Boolean>(false);
  const [tooltip, setTooltip] = useState<Boolean>(false);
  const [showContactModal, setShowContactModal] = useState<Boolean>(false);
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    document.title = "Foxtail";
  }, [])

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  const resetPhoneClick = () => {
    setResetPhoneVisible(!resetPhoneVisible);
  }

  const resetPassClick = () => {
    setResetPassVisible(!resetPassVisible);
  }

  const termsClick = () => {
    setTooltip(!tooltip);
  }

  const closeResetPhoneModal = () => {
    history.replace({ state: {} });
    setResetPhoneVisible(false);
    setToken(null);
  }

  const showError = (message: string) => {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
      toastId: "errVer"
    });
  }

  if (location && location.state && location.state.type) {
    switch (location.state.type) {
      case "phoneReset":
        if (location.state.token) {
          setResetPassVisible(true);
          setToken(location.state.token);
        } else if (!toast.isActive("errVer")) {
          showError(t("phonefail"));
        }
        break;
      case "passReset":
        if (location.state.token) {
          setResetPassVisible(true);
          setToken(location.state.token);
        } else if (!toast.isActive("errVer"))
          showError(t("passfail"));
        break;
      default:
        break;
    }
  }

  if (!tReady) {
    return <Spinner />;
  }

  const params = new URLSearchParams(location.search);

  return (
    <React.Fragment>
      <Header
        headerClasses={["landing"]}
        lang={lang}
        history={history}
        t={t}
        reactga={ReactGA}
        toast={toast}
        toggleResetPhone={resetPhoneClick}
        toggleResetPass={resetPassClick}
      />
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
                          toggleResetPhone={resetPhoneClick}
                          toggleResetPass={resetPassClick}
                          ErrorHandler={ErrorHandler}
                          lang={lang}
                          reactga={ReactGA}
                          history={history}
                          t={t}
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
                      history={history}
                      ReactGA={ReactGA}
                      refer={params.get("refer")}
                      aff={params.get("aff")}
                      mem={params.get("mem")}
                      eve={params.get("eve")}
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
        resetPassClick={resetPassClick}
        resetPhoneClick={resetPhoneClick}
        history={history}
        termsClick={termsClick}
        toggleContactModal={toggleContactModal}
        tooltip={tooltip}
      />
      {resetPassVisible && (
        <ResetPassModal
          t={t}
          token={token}
          close={() => {
            history.replace({ state: {} });
            setResetPassVisible(false);
            setToken(null);
          }}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
        />
      )}
      {resetPhoneVisible && (
        <ResetPhoneModal
          t={t}
          token={token}
          close={closeResetPhoneModal}
          ErrorHandler={ErrorHandler}
          history={history}
          lang={lang}
          ReactGA={ReactGA}
        />
      )}
      {showContactModal && (
        <ContactUsModal
          close={toggleContactModal}
          guest={true}
          header={t("common:Send us a Message")}
          description={t("common:Questions/Comments/Suggestions/etc...")}
          okText={t("common:Send")}
        />
      )}
      <ToastContainer position="top-center" hideProgressBar={true} />
    </React.Fragment>
  );
});

export default withTranslation("landing")(
  withAuth(session => session && session.currentuser)(Landing)
);
