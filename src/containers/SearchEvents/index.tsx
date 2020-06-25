import React, { memo, useState, useEffect, useRef } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { useQuery, withApollo } from "react-apollo";
import { Waypoint } from "react-waypoint";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from "body-scroll-lock";

import { SEARCH_EVENTS } from "queries";

import withLocation from "components/HOCs/withLocation";
import Spinner from "components/common/Spinner";
import ShareModal from "components/Modals/Share";
import deleteFromCache from "utils/deleteFromCache";
import { ISession } from "types/user";
import getLang from "utils/getLang";

import Header from "./Header";
import MyEvents from "./MyEvents";
import EventsList from "./EventsList";
import SearchEventToolbar from "./SearchEventToolbar/";

import "./searchEvents.css";

interface ISearchEventsProps extends WithTranslation, RouteComponentProps {
  ErrorHandler: any;
  ReactGA: any;
  session: ISession;
  dayjs: any;
  refetch: any;
  client: any;
  location: any;
}

const SearchEvents: React.FC<ISearchEventsProps> = memo(
  ({
    history,
    t,
    tReady,
    ErrorHandler,
    ReactGA,
    session,
    dayjs,
    client,
    location
  }) => {
    const [state, setState] = useState<any>({
      skip: 0,
      visible: false,
      blockModalVisible: false,
      shareModalVisible: false,
      event: null,
      lat: location.lat,
      long: location.long,
      maxDistance: 50,
      location: location.city,
      all: true,
      hasMore: true,
      elapse: false
    });

    const targetElement = useRef(null);

    const {
      event,
      shareModalVisible,
      all,
      lat,
      long,
      maxDistance,
      hasMore,
      elapse
    } = state;

    //TODO: Figure out why this doesnt populate lat and long on load
    const searchParams = {
      lat: 0,
      long: 0,
      maxDistance,
      all,
      limit: parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT),
      skip: 0
    };

    const { data, loading: queryLoading, fetchMore, error } = useQuery(
      SEARCH_EVENTS,
      {
        variables: searchParams,
        fetchPolicy: "cache-first"
      }
    );

    useEffect(() => {
      window.scrollTo(0, 1);

      //TODO: Figure out this
      // if (!location.lat) {
      //   this.timer = setInterval(() => this.tick(), 3000);
      // }

      if (state.lat !== location.lat) {
        setState({
          ...state,
          lat: location.lat,
          long: location.long,
          city: location.city
        });
      }
    });

    useEffect(() => {
      ErrorHandler.setBreadcrumb("Search Events Page");
      clearSearchResults();
      clearAllBodyScrollLocks();
    }, []);

    const clearSearchResults = () => {
      ErrorHandler.setBreadcrumb("Clear event results");
      const { cache } = client;
      deleteFromCache({ cache, query: "searchEvents" });
    };

    const setLocation = ({ lat, long, city }) => {
      ErrorHandler.setBreadcrumb("Set Location: lat:" + lat + " long:" + long);
      setState({ ...state, lat, long, city });
    };

    // const tick = () => {
    //   if (!state.elapse) {
    //     setState({ ...state, elapse: true });
    //   }
    // };

    const setShareModalVisible = (shareModalVisible) => {
      ErrorHandler.setBreadcrumb("share modal visible:" + shareModalVisible);
      if (shareModalVisible) {
        ReactGA.event({
          category: "Event",
          action: "Share Modal"
        });
      }
      if (event) setState({ ...state, event, shareModalVisible });
      else setState({ ...state, event: null, shareModalVisible });
    };

    const handleChangeSelect = (e) => {
      ErrorHandler.setBreadcrumb("Change max distance");
      setState({ ...state, maxDistance: parseInt(e.value), hasMore: true });
    };

    const fetchData = () => {
      ErrorHandler.setBreadcrumb("Fetch more events");
      const { hasMore } = state;

      if (hasMore) {
        setState({
          ...state,
          skip: state.skip + parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT)
        });
        fetchMore({
          variables: {
            limit: parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT),
            skip: state.skip
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (
              !fetchMoreResult ||
              fetchMoreResult.searchEvents.length <
                parseInt(process.env.REACT_APP_SEARCHEVENT_LIMIT)
            ) {
              setState({ ...state, hasMore: false });
              return previousResult;
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

    const handleEnd = ({ previousPosition, currentPosition }) => {
      if (state.hasMore) {
        if (previousPosition === Waypoint.below) {
          fetchData();
        }
        if (
          previousPosition === undefined &&
          currentPosition === Waypoint.inside
        ) {
          setState({ ...state, hasMore: false });
        }
      }
    };

    const toggleScroll = (enabled) => {
      if (targetElement) {
        enabled
          ? disableBodyScroll(targetElement.current)
          : enableBodyScroll(targetElement.current);
      }
    };

    //TODO: Find better way to load if lat and others takes time.
    if (!tReady || !session || (!lat && !elapse) || queryLoading) {
      document.title = t("common:Loading") + "...";
      return <Spinner page="searchEvents" title={t("upcomingevent")} />;
    }

    if (error) {
      return (
        <ErrorHandler.report
          error={error}
          calledName={"searchEvents"}
          userID={session.currentuser.userID}
        />
      );
    }

    const distanceMetric = session.currentuser.distanceMetric;
    const lang = getLang();
    ErrorHandler.setBreadcrumb("Search Events");
    document.title = t("searchevents");
    let resultsBody;

    if (!data || !data.searchEvents || data.searchEvents.length === 0) {
      resultsBody = (
        <section
          className="not-found"
          style={{
            display: "inline-block",
            position: "unset",
            top: "unset",
            transform: "unset"
          }}
        >
          <div className="container" ref={targetElement}>
            <div className="col-md-12">
              <div className="icon">
                <i className="nico event" />
              </div>
              <span className="head">{t("noeventavailable")}</span>
              <span className="description">{t("noeventavailabledes")}</span>
            </div>
          </div>
        </section>
      );
    } else if (!lat) {
      resultsBody = (
        <section className="not-found" style={{ display: "block" }}>
          <div className="container">
            <div className="col-md-12">
              <div className="icon">
                <i className="nico location" />
              </div>
              <span className="head">{t("Location not available.")}</span>
              <span className="description">
                {t(
                  "Please enable location services on your device to see this page."
                )}
              </span>
            </div>
          </div>
        </section>
      );
    } else {
      resultsBody = (
        <>
          <MyEvents
            t={t}
            ErrorHandler={ErrorHandler}
            dayjs={dayjs}
            distanceMetric={distanceMetric}
            lang={lang}
          />
          <EventsList
            events={data.searchEvents}
            handleEnd={({ previousPosition, currentPosition }) =>
              handleEnd({ previousPosition, currentPosition })
            }
            t={t}
            dayjs={dayjs}
            loading={hasMore}
            distanceMetric={distanceMetric}
            lang={lang}
          />
        </>
      );
    }

    return (
      <>
        <Header t={t} />
        <section className="go-events">
          <ErrorHandler.ErrorBoundary>
            <SearchEventToolbar
              location={location}
              setLocationValues={setLocation}
              handleChangeSelect={handleChangeSelect}
              maxDistance={maxDistance}
              t={t}
              ErrorHandler={ErrorHandler}
              distanceMetric={distanceMetric}
              lang={lang}
              history={history}
              ReactGA={ReactGA}
              toggleScroll={toggleScroll}
              dayjs={dayjs}
            />
          </ErrorHandler.ErrorBoundary>
          <ErrorHandler.ErrorBoundary>{resultsBody}</ErrorHandler.ErrorBoundary>
        </section>
        {event && (
          <ShareModal
            userID={session.currentuser.userID}
            event={event}
            visible={shareModalVisible}
            close={() => setShareModalVisible(false)}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
            t={t}
          />
        )}
      </>
    );
  }
);

export default withApollo(
  withRouter(withTranslation("searchevents")(withLocation(SearchEvents)))
);
