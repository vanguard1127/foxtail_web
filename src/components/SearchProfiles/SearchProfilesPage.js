import React, { Component, Fragment } from "react";
import withLocation from "../HOCs/withLocation";
import Spinner from "../common/Spinner";
import { withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import SearchCriteria from "./SearchCriteria";
import ProfilesContainer from "./ProfilesContainer";
import { kinkOptions } from "../../docs/options";
import deleteFromCache from "../../utils/deleteFromCache";
export const Context = React.createContext();
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
    lang: this.props.searchCriteria.lang,
    elapse: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.loading !== nextProps.loading ||
      this.props.location.long !== nextProps.location.long ||
      this.props.location.lat !== nextProps.location.lat ||
      this.state.lat !== nextState.lat ||
      this.state.elapse !== nextState.elapse ||
      this.state.long !== nextState.long ||
      this.state.city !== nextState.city ||
      this.state.country !== nextState.country ||
      this.state.distance !== nextState.distance ||
      this.state.distanceMetric !== nextState.distanceMetric ||
      this.state.ageRange !== nextState.ageRange ||
      this.state.interestedIn !== nextState.interestedIn ||
      this.state.lang !== nextState.lang ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  //TODO: figure out
  UNSAFE_componentWillUpdate(nextProps) {
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
  //TODO: REMOVE EXCESS SENTRY
  componentDidMount() {
    try {
      this.props.ErrorHandler.setBreadcrumb("Search Profile Page");
      this.clearSearchResults();
      this.start = Date.now();
      if (!this.props.location.lat) {
        this.props.ErrorHandler.setBreadcrumb("timer");
        this.timer = setInterval(() => this.tick(), 3000);
      }
    } catch (res) {
      this.props.ErrorHandler.catchErrors(res);
    }
  }

  clearSearchResults = () => {
    this.props.ErrorHandler.setBreadcrumb("Clear results");
    const { cache } = this.props.client;
    deleteFromCache({ cache, query: "searchProfiles" });
  };

  tick() {
    this.props.ErrorHandler.setBreadcrumb("tick");
    if (!this.state.elapse) {
      this.setState({
        elapse: true
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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
      refetch,
      session,
      loading,
      refetchSettings,
      client,
      history,
      locationErr,
      ReactGA,
      toggleShareModal,
      dayjs
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
      interestedIn,
      elapse
    } = this.state;

    let body = null;
    if ((!lat && !elapse) || !session) {
      body = <Spinner message={t("common:Loading")} size="large" />;
    } else if (!lat) {
      body = locationErr;
    } else {
      body = (
        <Context.Provider value={{ kinkOptions }}>
          <ProfilesContainer
            loading={loading}
            t={t}
            history={history}
            lat={lat}
            long={long}
            distance={distance}
            distanceMetric={session.currentuser.distanceMetric}
            likesSent={session.currentuser.likesSent}
            msgsSent={session.currentuser.msgsSent}
            ageRange={ageRange}
            interestedIn={interestedIn}
            ErrorHandler={ErrorHandler}
            dayjs={dayjs}
            client={client}
            isBlackMember={session.currentuser.blackMember.active}
            locationErr={locationErr}
            refetchUser={refetch}
            userID={session.currentuser.userID}
            ReactGA={ReactGA}
            toggleShareModal={toggleShareModal}
          />
        </Context.Provider>
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
            refetchSettings={refetchSettings}
            ErrorHandler={ErrorHandler}
            isBlackMember={session.currentuser.blackMember.active}
            ReactGA={ReactGA}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>{body}</ErrorHandler.ErrorBoundary>
      </Fragment>
    );
  }
}

export default withRouter(withApollo(withLocation(SearchProfilesPage)));
