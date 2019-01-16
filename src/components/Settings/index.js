import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { Query } from "react-apollo";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";

import SettingsPage from "./SettingsPage";

class Settings extends Component {
  render() {
    const { session, refetch, t } = this.props;

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
                {t("loggedin")}: 03 October 2018 13:34
              </span>
            </div>
          </div>
        </section>{" "}
        <Query query={GET_SETTINGS} fetchPolicy="network-only">
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <Spinner message={t("common:Loading") + "..."} size="large" />
              );
            }
            if (error) {
              return <div>{error.message}</div>;
            }
            if (!data.getSettings) {
              return <div>{t("Error occured. Please contact support!")}</div>;
            }

            const settings = data.getSettings;
            return (
              <Fragment>
                <SettingsPage settings={settings} refetchUser={refetch} t={t} />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withNamespaces()(Settings))
);
