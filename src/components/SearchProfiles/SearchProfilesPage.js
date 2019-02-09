import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';
import withLocation from '../withLocation';
import withAuth from '../withAuth';
import { withRouter } from 'react-router-dom';
import SearchCriteria from './SearchCriteria';
import ProfilesContainer from './ProfilesContainer';
import Tour from './Tour';

class SearchProfilesPage extends Component {
  state = {
    lat: this.props.location.lat,
    long: this.props.location.long,
    ...this.props.searchCriteria
  };

  componentDidMount() {
    this.props.ErrorHandler.setBreadcrumb('Search Profile Page');
  }

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  setLocation = async ({ lat, long }) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Set Location: lat:' + lat + ' long:' + long
    );
    await this.setState({ long, lat });
  };

  render() {
    const { t, ErrorHandler, loading, session } = this.props;

    if (session.currentuser.tours.indexOf('sp') < 0) {
      ErrorHandler.setBreadcrumb('Opened Tour: Search Profiles');
      return (
        <Tour ErrorHandler={ErrorHandler} refetchUser={this.props.refetch} />
      );
    }

    return (
      <Fragment>
        <ErrorHandler.ErrorBoundary>
          <SearchCriteria
            t={t}
            setLocation={this.setLocation}
            setValue={this.setValue}
            loading={loading}
            searchCriteria={this.state}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>
          <ProfilesContainer
            t={t}
            history={this.props.history}
            searchCriteria={this.state}
            loading={loading}
            ErrorHandler={ErrorHandler}
          />
        </ErrorHandler.ErrorBoundary>
      </Fragment>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withLocation(withNamespaces('searchprofiles')(SearchProfilesPage))
  )
);
