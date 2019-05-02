import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import dayjs from "dayjs";

import { toast } from "react-toastify";
import { Query } from "react-apollo";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../HOCs/withAuth";
import SettingsPage from "./SettingsPage";
import validateLang from "../../utils/validateLang";
const lang = validateLang(localStorage.getItem("i18nextLng"));
const locale = lang !== null ? lang : "en";
require("dayjs/locale/" + locale);
class Settings extends Component {
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    const { session, t } = this.props;

    if (!session.currentuser.isProfileOK) {
      const toastId = "nopro";
      if (!toast.isActive(toastId)) {
        toast.info(t("plscomplete"), {
          position: toast.POSITION.TOP_CENTER,
          toastId: toastId
        });
      }
    }

    this.mounted = true;
    document.title = t("myacct");
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { session, refetch, t, ErrorHandler, location, history } = this.props;
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
                />
              )}
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
