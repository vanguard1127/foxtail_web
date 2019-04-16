import React, { Component } from "react";

import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import dayjs from "dayjs";
import { SEARCH_EVENTS } from "../../queries";
import { SEARCHEVENT_LIMIT } from "../../docs/consts";
import EmptyScreen from "../common/EmptyScreen";
import { Waypoint } from "react-waypoint";
import ShareModal from "../Modals/Share";
import MyEvents from "./MyEvents";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import SearchEventToolbar from "./SearchEventToolbar";
import Header from "./Header";
import Tour from "./Tour";
import EventsList from "./EventsList";
import Spinner from "../common/Spinner";
import validateLang from "../../utils/validateLang";
const lang = validateLang(localStorage.getItem("i18nextLng"));
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
    hasMore: true
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
    document.title = "Search Events";
  }
  componentWillUnmount() {
    this.mounted = false;
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

  handleSubmit = (e, createEvent, t) => {
    this.props.ErrorHandler.setBreadcrumb("Create event");
    e.preventDefault();
    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      createEvent()
        .then(({ data }) => {
          alert(t("eventcreated"));
          this.props.history.push("/event/" + data.createEvent.id);
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  fetchData = fetchMore => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more events");

    if (this.mounted) {
      fetchMore({
        variables: {
          limit: SEARCHEVENT_LIMIT,
          skip: this.state.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || fetchMoreResult.searchEvents.length === 0) {
            this.setState({ hasMore: false });
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

  handleEnd = (previousPosition, fetchMore) => {
    if (this.state.hasMore) {
      if (previousPosition === Waypoint.below) {
        if (this.mounted) {
          this.setState(
            state => ({ skip: this.state.skip + SEARCHEVENT_LIMIT }),
            () => this.fetchData(fetchMore)
          );
        }
      }
    }
  };

  render() {
    const {
      event,
      shareModalVisible,
      all,
      lat,
      long,
      maxDistance,
      location,
      hasMore
    } = this.state;
    const { t, ErrorHandler, session, refetch } = this.props;
    const distanceMetric = session.currentuser.distanceMetric;
    ErrorHandler.setBreadcrumb("Search Events");

    if (session.currentuser.tours.indexOf("se") < 0) {
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
              />
            </ErrorHandler.ErrorBoundary>
            <ErrorHandler.ErrorBoundary>
              <MyEvents
                t={t}
                ErrorHandler={ErrorHandler}
                dayjs={dayjs}
                distanceMetric={distanceMetric}
              />
            </ErrorHandler.ErrorBoundary>
            <ErrorHandler.ErrorBoundary>
              {" "}
              <Query
                query={SEARCH_EVENTS}
                variables={{
                  lat,
                  long,
                  maxDistance,
                  all,
                  limit: SEARCHEVENT_LIMIT,
                  skip: 0
                }}
                fetchPolicy="cache-first"
              >
                {({ data, loading, error, fetchMore }) => {
                  if (loading) {
                    return (
                      <Spinner page="searchEvents" title={t("upcomingevent")} />
                    );
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
                  if (
                    !data ||
                    !data.searchEvents ||
                    data.searchEvents.length === 0
                  ) {
                    return <EmptyScreen message={t("noeventavailable")} />;
                  }

                  return (
                    <EventsList
                      events={data.searchEvents}
                      handleEnd={previous =>
                        this.handleEnd(previous, fetchMore)
                      }
                      t={t}
                      dayjs={dayjs}
                      loading={hasMore}
                      distanceMetric={distanceMetric}
                    />
                  );
                }}
              </Query>
            </ErrorHandler.ErrorBoundary>
          </section>
        </>

        {event && (
          <ShareModal
            event={event}
            visible={shareModalVisible}
            close={() => this.setShareModalVisible(false)}
            ErrorBoundary={ErrorHandler.ErrorBoundary}
          />
        )}
      </>
    );
  }
}

export default withRouter(
  withAuth(session => session && session.currentuser)(
    withLocation(withNamespaces("searchevents")(SearchEvents))
  )
);
