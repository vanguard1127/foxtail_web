import React, { Component, Fragment } from "react";
import dayjs from "dayjs";
import withLocation from "../HOCs/withLocation";
import withAuth from "../HOCs/withAuth";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import SearchCriteria from "./SearchCriteria";
import ProfilesContainer from "./ProfilesContainer";
import Tour from "./Tour";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);

class SearchProfilesPage extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.loading !== nextProps.loading ||
      this.props.location.long !== nextProps.location.long ||
      this.props.location.lat !== nextProps.location.lat ||
      this.state.lat !== nextState.lat ||
      this.state.long !== nextState.long ||
      this.state.city !== nextState.city ||
      this.state.country !== nextState.country ||
      this.state.distance !== nextState.distance ||
      this.state.distanceMetric !== nextState.distanceMetric ||
      this.state.ageRange !== nextState.ageRange ||
      this.state.interestedIn !== nextState.interestedIn ||
      this.state.lang !== nextState.lang
    ) {
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps) {
    if (
      this.props.location.lat === undefined &&
      nextProps.location.lat !== undefined
    ) {
      this.setState({
        lat: nextProps.location.lat,
        long: nextProps.location.long,
        city: nextProps.location.city,
        country: nextProps.location.country
      });
    }
  }

  componentDidMount() {
    this.props.ErrorHandler.setBreadcrumb("Search Profile Page");
  }

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  setLocation = async ({ lat, long, city, country }) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Set Location: lat:" + lat + " long:" + long
    );

    this.setState({ long, lat, city, country });
  };

  render() {
    const {
      t,
      ErrorHandler,
      session,
      loading,
      refetch,
      client,
      history,
      locationErr
    } = this.props;

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

    if (session.currentuser.tours.indexOf("sp") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Search Profiles");
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={refetch} />
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
            ErrorHandler={ErrorHandler}
            isBlackMember={session.currentuser.blackMember.active}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>
          {!lat ? (
            locationErr
          ) : (
            <ProfilesContainer
              loading={loading}
              t={t}
              history={history}
              lat={lat}
              long={long}
              distance={distance}
              distanceMetric={session.currentuser.distanceMetric}
              ageRange={ageRange}
              interestedIn={interestedIn}
              ErrorHandler={ErrorHandler}
              dayjs={dayjs}
              client={client}
              isBlackMember={session.currentuser.blackMember.active}
            />
          )}
        </ErrorHandler.ErrorBoundary>
      </Fragment>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withApollo(withLocation(SearchProfilesPage))
  )
);
