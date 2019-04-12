import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import dayjs from "dayjs";

import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";
import validateLang from "../../utils/validateLang";

import SettingsPage from "./SettingsPage";
class Settings extends Component {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    const { session } = this.props;
    const lang = validateLang(localStorage.getItem("i18nextLng"));
    require("dayjs/locale/" + lang);
    if (!session.currentuser.isProfileOK) {
      const toastId = "nopro";
      if (!toast.isActive(toastId)) {
        toast.info("Please complete your profile.", {
          position: toast.POSITION.TOP_CENTER,
          toastId: toastId
        });
      }
    }

    document.title = "My Account";
  }

  render() {
    const { session, refetch, t, ErrorHandler, location, history } = this.props;
    const { state } = location;

    let isCouple = false;
    let isInitial = false;
    let showBlkModal = false;
    let showCplModal = false;

    if (state) {
      if (state.couple) isCouple = state.couple;
      if (state.initial) isInitial = state.initial;
      if (state.showBlkMdl) showBlkModal = state.showBlkMdl;
      if (state.showCplMdl) showCplModal = state.showCplMdl;
    }

    return (
      <Query query={GET_SETTINGS} fetchPolicy="network-only">
        {({ data, loading, error }) => {
          if (loading || !data.getSettings) {
            return (
              <Spinner message={t("common:Loading") + "..."} size="large" />
            );
          }
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
                        .locale(localStorage.getItem("i18nextLng"))
                        .format("MMMM DD, YYYY @ HH:mm")}
                    </span>
                  </div>
                </div>
              </section>{" "}
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
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withNamespaces("settings")(Settings)
  )
);
