import React, { memo, useState, useEffect } from "react";
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
import NoEvents from "./NoEvents";
import NoLocation from "./NoLocation";
import SearchEventToolbar from "./SearchEventToolbar/";

import "./searchEvents.css";

interface ISearchEventsProps extends WithTranslation {
  ErrorHandler: any;
  ReactGA: any;
  session: ISession;
  dayjs: any;
  refetch: any;
  client: any;
  location: any;
}

//TODO: Figure out which children should use memo
const SearchEvents: React.FC<ISearchEventsProps> = memo(
  ({ t, tReady, ErrorHandler, ReactGA, session, dayjs, client, location }) => {
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
      lat: 32.7830317,
      long: -117.1923924,
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
      //TODO: finish later
      //   enabled
      //     ? disableBodyScroll(targetElement.current)
      //     : enableBodyScroll(targetElement.current);
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

    const distanceMetric: string = session.currentuser.distanceMetric;
    const lang: string = getLang();
    ErrorHandler.setBreadcrumb("Search Events");
    document.title = t("searchevents");
    let resultsBody;

    if (!data || !data.searchEvents || data.searchEvents.length === 0) {
      resultsBody = <NoEvents t={t} />;
    } else if (!lat) {
      resultsBody = <NoLocation t={t} />;
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

//TODO: Can we use useApollo instead? it errored
export default withApollo(
  withTranslation("searchevents")(withLocation(SearchEvents))
);
