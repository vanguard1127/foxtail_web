// @flow
import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_SEARCH_SETTINGS } from "../../queries";
import SearchProfilesPage from "./SearchProfilesPage";
import { withTranslation } from "react-i18next";

class SearchProfiles extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    document.title = "Search Profiles";
    const { t, ErrorHandler, ReactGA } = this.props;

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
          if (!data.getSettings || loading) {
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
