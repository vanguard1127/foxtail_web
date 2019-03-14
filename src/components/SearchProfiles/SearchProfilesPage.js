import React, { PureComponent, Fragment } from 'react';
import withLocation from '../withLocation';
import withAuth from '../withAuth';
import { withRouter } from 'react-router-dom';
import SearchCriteria from './SearchCriteria';
import ProfilesContainer from './ProfilesContainer';
import Tour from './Tour';

class SearchProfilesPage extends PureComponent {
  state = {
    lat: this.props.location.lat,
    long: this.props.location.long,
    city: this.props.location.city || this.props.searchCriteria.city,
    country: this.props.location.country || this.props.searchCriteria.country,
    distance: this.props.searchCriteria.distance,
    distanceMetric: this.props.searchCriteria.distanceMetric,
    ageRange: this.props.searchCriteria.ageRange,
    interestedIn: this.props.searchCriteria.interestedIn,
    lang: this.props.searchCriteria.lang
  };

  componentDidMount() {
    this.props.ErrorHandler.setBreadcrumb('Search Profile Page');
  }

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  setLocation = async ({ lat, long, city, country }) => {
    this.props.ErrorHandler.setBreadcrumb(
      'Set Location: lat:' + lat + ' long:' + long
    );

    this.setState({ long, lat, city, country });
  };

  render() {
    const { t, ErrorHandler, session, loading, refetch } = this.props;

    const {
      lat,
      long,
      city,
      country,
      distance,
      distanceMetric,
      ageRange,
      lang,
      interestedIn
    } = this.state;

    if (session.currentuser.tours.indexOf('sp') < 0) {
      ErrorHandler.setBreadcrumb('Opened Tour: Search Profiles');
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={this.props.refetch} />
        </div>
      );
    }

    return (
      <Fragment>
        <ErrorHandler.ErrorBoundary>
          <SearchCriteria
            loading={loading}
            t={t}
            setLocation={this.setLocation}
            setValue={this.setValue}
            lat={lat}
            long={long}
            lang={lang}
            distance={distance}
            distanceMetric={distanceMetric}
            ageRange={ageRange}
            interestedIn={interestedIn}
            city={city}
            country={country}
            refetch={refetch}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>
          <ProfilesContainer
            loading={loading}
            t={t}
            history={this.props.history}
            lat={lat}
            long={long}
            distance={distance}
            ageRange={ageRange}
            interestedIn={interestedIn}
            ErrorHandler={ErrorHandler}
          />
        </ErrorHandler.ErrorBoundary>
      </Fragment>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withLocation(SearchProfilesPage)
  )
);
