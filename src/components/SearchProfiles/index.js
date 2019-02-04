// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { GET_SEARCH_SETTINGS } from '../../queries';
import SearchProfilesPage from './SearchProfilesPage';

const SearchProfiles = ({ t, ErrorHandler }) => {
  ErrorHandler.setBreadcrumb('Enter Search Profiles');
  document.title = 'Profiles';

  return (
    <Query query={GET_SEARCH_SETTINGS} fetchPolicy="cache-and-network">
      {({ data, loading, error }) => {
        if (loading) {
          return (
            <SearchProfilesPage
              t={t}
              ErrorHandler={ErrorHandler}
              loading={loading}
            />
          );
        }
        if (error || !data.getSettings) {
          return (
            <ErrorHandler.report
              error={error}
              calledName={'getSearchSettings'}
            />
          );
        }

        return (
          <SearchProfilesPage
            t={t}
            ErrorHandler={ErrorHandler}
            searchCriteria={data.getSettings}
          />
        );
      }}
    </Query>
  );
};

export default SearchProfiles;
