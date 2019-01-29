import React from "react";
import { Query } from "react-apollo";
import { GET_SEARCH_SETTINGS } from "../../queries";
import SearchProfilesPage from "./SearchProfilesPage";

const SearchProfiles = ({ t, ErrorBoundary }) => {
  return (
    <Query query={GET_SEARCH_SETTINGS} fetchPolicy="network-only">
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <SearchProfilesPage
              t={t}
              ErrorBoundary={ErrorBoundary}
              loading={loading}
            />
          );
        }
        if (error) {
          return <div>{error.message}</div>;
        }
        if (!data.getSettings) {
          return <div>{t("Error occured. Please contact support!")}</div>;
        }
        console.log(data.getSettings);
        const {
          long,
          lat,
          distance,
          distanceMetric,
          ageRange,
          interestedIn,
          location
        } = data.getSettings;
        return (
          <SearchProfilesPage
            t={t}
            ErrorBoundary={ErrorBoundary}
            searchCriteria={{
              long,
              lat,
              distance,
              distanceMetric,
              ageRange,
              interestedIn,
              location
            }}
          />
        );
      }}
    </Query>
  );
};

export default SearchProfiles;
