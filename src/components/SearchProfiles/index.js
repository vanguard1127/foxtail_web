// @flow
import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_SEARCH_SETTINGS } from "../../queries";
import SearchProfilesPage from "./SearchProfilesPage";
import Spinner from "../common/Spinner";
import { withTranslation } from "react-i18next";

class SearchProfiles extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.tReady !== nextProps.tReady) {
      return true;
    }
    return false;
  }
  render() {
    const { t, ErrorHandler, ReactGA, tReady } = this.props;
    document.title = t("common:Search Profiles");
    if (!tReady) {
      return <Spinner />;
    }
    ErrorHandler.setBreadcrumb("Enter Search Profiles");
    return (
      <Query query={GET_SEARCH_SETTINGS} fetchPolicy="cache-and-network">
        {({ data, loading, error, refetch }) => {
          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getSearchSettings"}
              />
            );
          }
          if (!data || !data.getSettings || loading) {
            return null;
          }
          return (
            <SearchProfilesPage
              refetch={refetch}
              loading={loading}
              t={t}
              ErrorHandler={ErrorHandler}
              searchCriteria={data.getSettings}
              ReactGA={ReactGA}
            />
          );
        }}
      </Query>
    );
  }
}

export default withTranslation("searchprofiles")(SearchProfiles);
