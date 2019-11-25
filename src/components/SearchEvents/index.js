import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Query, withApollo } from "react-apollo";
import dayjs from "dayjs";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";
import { SEARCH_EVENTS } from "../../queries";
import { Waypoint } from "react-waypoint";
import ShareModal from "../Modals/Share";
import MyEvents from "./MyEvents";
import withLocation from "../HOCs/withLocation";
import SearchEventToolbar from "./SearchEventToolbar/";
import Header from "./Header";
import Tour from "./Tour";
import EventsList from "./EventsList";
import Spinner from "../common/Spinner";
import deleteFromCache from "../../utils/deleteFromCache";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);

class SearchEvents extends Component {
  state = {
    skip: 0,
    visible: false,
    blockModalVisible: false,
    shareModalVisible: false,
    event: null,
    lat: this.props.location.lat,
    long: this.props.location.long,
    maxDistance: 50,
    location: this.props.location.city,
    all: true,
    hasMore: true,
    elapse: false
  };

  constructor(props) {
    super(props);
    this.targetElement = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state !== nextState ||
      this.props.location.lat !== nextProps.location.lat ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady ||
      this.state.elapse !== nextState.elapse
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    window.scrollTo(0, 1);
    this.mounted = true;
    if (!this.props.location.lat) {
      this.timer = setInterval(() => this.tick(), 3000);
    }
  }
  componentWillUnmount() {
    deleteFromCache({ cache: this.props.client.cache, query: "searchEvents" });
    clearAllBodyScrollLocks();
    clearInterval(this.timer);
    this.mounted = false;
  }

  //TODO: figure out what to do with this
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.location.lat === undefined &&
      nextProps.location.lat !== undefined
    ) {
      this.setState({
        lat: nextProps.location.lat,
        long: nextProps.location.long,
        location: nextProps.location.city
      });
    }
  }

  tick() {
    if (!this.state.elapse) {
      this.setState({
        elapse: true
      });
    }
  }

  showModal = () => {
    this.props.ErrorHandler.setBreadcrumb("Show Modal in Events");
    if (this.mounted) {
      this.setState({ visible: true });
    }
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.props.ErrorHandler.setBreadcrumb("Cancel event popup");
    if (this.mounted) {
      this.setState({ event: null, visible: false });
    }
  };

  setShareModalVisible = (shareModalVisible, event) => {
    this.props.ErrorHandler.setBreadcrumb(
      "share modal visible:" + shareModalVisible
    );
    if (shareModalVisible) {
      this.props.ReactGA.event({
        category: "Event",
        action: "Share Modal"
      });
    }
    if (this.mounted) {
      if (event) this.setState({ event, shareModalVisible });
      else this.setState({ event: null, shareModalVisible });
    }
  };

  setBlockModalVisible = (blockModalVisible, event) => {
    this.props.ErrorHandler.setBreadcrumb(
      "Block Modal visible:" + blockModalVisible
    );
    if (this.mounted) {
      if (event) this.setState({ event, blockModalVisible });
      else this.setState({ event: null, blockModalVisible });
    }
  };

  handleChangeSelect = e => {
    this.props.ErrorHandler.setBreadcrumb("Change max distance");
    if (this.mounted) {
      this.setState({ maxDistance: parseInt(e.value), hasMore: true });
    }
  };

  setLocationValues = async ({ lat, long, address }) => {
    this.props.ErrorHandler.setBreadcrumb("Set location");

    if (this.mounted) {
      this.setState({ lat, long, address, hasMore: true });
    }
  };

  fetchData = fetchMore => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more events");

    if (this.mounted) {
      fetchMore({
        variables: {
          limit: parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT),
          skip: this.state.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            fetchMoreResult.searchEvents.length <
              parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT)
          ) {
            this.setState({
              hasMore: false
            });
          }

          return {
            searchEvents: [
              ...previousResult.searchEvents,
              ...fetchMoreResult.searchEvents
            ]
          };
        }
      });
    }
  };

  handleEnd = ({ previousPosition, currentPosition, fetchMore }) => {
    if (this.state.hasMore) {
      if (previousPosition === Waypoint.below) {
        if (this.mounted) {
          this.setState(
            {
              skip:
                this.state.skip +
                parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT)
            },
            () => this.fetchData(fetchMore)
          );
        }
      }
      if (
        previousPosition === undefined &&
        currentPosition === Waypoint.inside
      ) {
        this.setState({ hasMore: false });
      }
    }
  };

  toggleScroll(enabled) {
    if (this.targetElement) {
      enabled
        ? disableBodyScroll(this.targetElement.current)
        : enableBodyScroll(this.targetElement.current);
    }
  }

  render() {
    const {
      event,
      shareModalVisible,
      all,
      lat,
      long,
      maxDistance,
      location,
      hasMore,
      elapse
    } = this.state;
    const {
      t,
      ErrorHandler,
      session,
      refetch,
      history,
      ReactGA,
      tReady
    } = this.props;
    if (!tReady || !session || (!lat && !elapse)) {
      return <Spinner />;
    }
    const distanceMetric = session.currentuser.distanceMetric;
    ErrorHandler.setBreadcrumb("Search Events");

    if (session && session.currentuser.tours.indexOf("se") < 0) {
      ErrorHandler.setBreadcrumb("Opened Tour: Search Events");
      return (
        <div>
          <Tour ErrorHandler={ErrorHandler} refetchUser={refetch} />
        </div>
      );
    }

    return (
      <>
        <>
          <Header t={t} />
          <section className="go-events">
            <ErrorHandler.ErrorBoundary>
              <SearchEventToolbar
                location={location}
                setLocationValues={this.setLocationValues}
                handleChangeSelect={this.handleChangeSelect}
                maxDistance={maxDistance}
                t={t}
                ErrorHandler={ErrorHandler}
                distanceMetric={distanceMetric}
                lang={lang}
                history={history}
                ReactGA={ReactGA}
                toggleScroll={this.toggleScroll}
              />
            </ErrorHandler.ErrorBoundary>
            <ErrorHandler.ErrorBoundary>
              <MyEvents
                t={t}
                ErrorHandler={ErrorHandler}
                dayjs={dayjs}
                distanceMetric={distanceMetric}
                lang={lang}
              />
            </ErrorHandler.ErrorBoundary>
            <ErrorHandler.ErrorBoundary>
              {" "}
              {lat ? (
                <Query
                  query={SEARCH_EVENTS}
                  variables={{
                    lat,
                    long,
                    maxDistance,
                    all,
                    limit: parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT),
                    skip: 0
                  }}
                  fetchPolicy="cache-first"
                >
                  {({ data, loading, error, fetchMore }) => {
                    if (loading) {
                      document.title = t("common:Loading") + "...";
                      return (
                        <Spinner
                          page="searchEvents"
                          title={t("upcomingevent")}
                        />
                      );
                    }

                    document.title = this.props.t("searchevents");
                    if (error) {
                      return (
                        <ErrorHandler.report
                          error={error}
                          calledName={"searchEvents"}
                          userID={session.currentuser.userID}
                        />
                      );
                    }

                    if (
                      !data ||
                      !data.searchEvents ||
                      data.searchEvents.length === 0
                    ) {
                      return (
                        <section
                          className="not-found"
                          style={{
                            display: "inline-block",
                            position: "unset",
                            top: "unset",
                            transform: "unset"
                          }}
                        >
                          <div className="container" ref={this.targetElement}>
                            <div className="col-md-12">
                              <div className="icon">
                                <i className="nico event" />
                              </div>
                              <span className="head">
                                {t("noeventavailable")}
                              </span>
                              <span className="description">
                                {t("noeventavailabledes")}
                              </span>
                            </div>
                          </div>
                        </section>
                      );
                    }

                    document.title = this.props.t("searchevents");
                    return (
                      <EventsList
                        events={data.searchEvents}
                        handleEnd={({ previousPosition, currentPosition }) =>
                          this.handleEnd({
                            previousPosition,
                            currentPosition,
                            fetchMore
                          })
                        }
                        t={t}
                        dayjs={dayjs}
                        loading={hasMore}
                        distanceMetric={distanceMetric}
                        lang={lang}
                      />
                    );
                  }}
                </Query>
              ) : (
                <section className="not-found" style={{ display: "block" }}>
                  <div className="container">
                    <div className="col-md-12">
                      <div className="icon">
                        <i className="nico location" />
                      </div>
                      <span className="head">
                        {t("Location not available.")}
                      </span>
                      <span className="description">
                        {t(
                          "Please enable location services on your device to see this page."
                        )}
                      </span>
                    </div>
                  </div>
                </section>
              )}
            </ErrorHandler.ErrorBoundary>
          </section>
        </>

        {event && (
          <ShareModal
            userID={session.currentuser.userID}
            event={event}
            visible={shareModalVisible}
            close={() => this.setShareModalVisible(false)}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            t={t}
          />
        )}
      </>
    );
  }
}

export default withApollo(
  withRouter(withTranslation("searchevents")(withLocation(SearchEvents)))
);
