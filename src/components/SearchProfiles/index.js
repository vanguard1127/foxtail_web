// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { GET_SEARCH_SETTINGS } from '../../queries';
import SearchProfilesPage from './SearchProfilesPage';
import { withNamespaces } from 'react-i18next';

const SearchProfiles = ({ t, ErrorHandler }) => {
  ErrorHandler.setBreadcrumb('Enter Search Profiles');
  document.title = 'Profiles';
  return (
    <Query query={GET_SEARCH_SETTINGS} fetchPolicy="cache-and-network">
      {({ data, loading, error, refetch }) => {
        if (error) {
          return (
            <ErrorHandler.report
              error={error}
              calledName={'getSearchSettings'}
            />
          );
        }
        return (
          <SearchProfilesPage
            refetch={refetch}
            loading={loading}
            t={t}
            ErrorHandler={ErrorHandler}
            searchCriteria={data.getSettings}
          />
        );
      }}
    </Query>
  );
};

export default withNamespaces('searchprofiles')(SearchProfiles);
