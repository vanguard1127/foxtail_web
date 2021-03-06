import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Query } from "react-apollo";
import { toast } from "react-toastify";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import SettingsPage from "./SettingsPage";
import "./settings.css";
import "../../assets/css/breadcrumb.css";

class Settings extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady ||
      this.props.session.currentuser !== nextProps.session.currentuser
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
    document.title = this.props.t("common:myaccount");
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {
      session,
      refetch,
      t,
      ErrorHandler,
      location,
      history,
      ReactGA,
      tReady,
      dayjs,
      lang
    } = this.props;
    if (!tReady) {
      return <Spinner />;
    }
    const { state } = location;

    let isCouple = false;
    let isInitial = false;
    let showBlkModal = false;
    let showCplModal = false;

    //For page open responses
    if (state) {
      if (state.couple) isCouple = state.couple;
      if (state.initial) isInitial = state.initial;
      if (state.showBlkMdl) showBlkModal = state.showBlkMdl;
      if (state.showCplMdl) showCplModal = state.showCplMdl;
    }

    return (
      <Query
        query={GET_SETTINGS}
        fetchPolicy="cache-and-network"
        returnPartialData={true}
        variables={{
          isMobile: sessionStorage.getItem("isMobile"),
          maxW: window.outerWidth,
          maxH: window.outerHeight
        }}
      >
        {({ data, loading, error }) => {
          if (
            loading ||
            !data.getSettings ||
            !session ||
            !session.currentuser
          ) {
            document.title = t("common:Loading") + "...";
            return (
              <div
                style={{
                  minHeight: "74vh",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Spinner message={t("common:Loading") + "..."} size="large" />
              </div>
            );
          }
          document.title = t("common:myaccount");
          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName="getSettings"
                userID={session.currentuser.userID}
              />
            );
          }

          const settings = data.getSettings;

          const { about, publicPhotos, profilePic, kinks } = settings;

          let aboutErr = null;
          if (about === "") {
            aboutErr = t("fillbio");
          } else if (about.length <= 20) {
            aboutErr = t("biolen");
          }

          let profilePicErr = null;
          if (publicPhotos.length === 0) {
            profilePicErr = t("onepho");
          } else if (profilePic === "") {
            profilePicErr = t("selpho");
          }

          let kinksErr = kinks.length === 0 ? t("onedes") : null;

          const errors = {
            profilePic: profilePicErr,
            about: aboutErr,
            kinks: kinksErr
          };

          return (
            <Fragment>
              <section className="breadcrumb settings">
                <div className="container">
                  <div className="col-md-12">
                    <span className="head">
                      <span>
                        {t("Hello")}, {session.currentuser.username} 👋
                      </span>
                    </span>
                    <span className="title">
                      {t("loggedin")}:{" "}
                      {dayjs(settings.lastActive)
                        .locale(lang)
                        .format("MMMM DD, YYYY @ HH:mm")}
                    </span>
                  </div>
                </div>
              </section>{" "}
              {this.mounted && (
                <SettingsPage
                  t={t}
                  settings={settings}
                  refetchUser={refetch}
                  isCouple={isCouple}
                  isInitial={isInitial}
                  showBlkModal={showBlkModal}
                  showCplModal={showCplModal}
                  ErrorHandler={ErrorHandler}
                  history={history}
                  currentuser={session.currentuser}
                  dayjs={dayjs}
                  lang={lang}
                  ReactGA={ReactGA}
                  errors={errors}
                  toast={toast}
                />
              )}
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(withTranslation("settings")(Settings));
