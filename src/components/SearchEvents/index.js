import React, { Component, Fragment } from "react";

import { withNamespaces } from "react-i18next";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EmptyScreen from "../common/EmptyScreen";
import Waypoint from "react-waypoint";
import ShareModal from "../Modals/Share";
import MyEvents from "./MyEvents";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import SearchEventToolbar from "./SearchEventToolbar";
import Header from "./Header";
import EventsList from "./EventsList";
import Spinner from "../common/Spinner";

const LIMIT = 6;

//TODO: fix moment date format issue
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
    location: "My Location",
    all: true
  };

  clearState = () => {
    this.setState({
      skip: 0,
      visible: false,
      blockModalVisible: false,
      shareModalVisible: false,
      event: null,
      lat: this.props.location.lat,
      long: this.props.location.long,
      maxDistance: 50,
      location: "My Location",
      all: true
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ event: null, visible: false });
  };

  setShareModalVisible = (shareModalVisible, event) => {
    if (event) this.setState({ event, shareModalVisible });
    else this.setState({ event: null, shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, event) => {
    if (event) this.setState({ event, blockModalVisible });
    else this.setState({ event: null, blockModalVisible });
  };

  handleChangeSelect = e => {
    this.setState({ maxDistance: parseInt(e.value) });
  };

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      this.setState({ lat, long, location: address });
    } else {
      this.setState({ location: address });
    }
  };

  handleSubmit = (e, createEvent, t) => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      createEvent()
        .then(({ data }) => {
          alert(t("eventcreated"));
          this.props.history.push("/events/" + data.createEvent.id);
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  fetchData = fetchMore => {
    this.setState({ loading: true });
    fetchMore({
      variables: {
        limit: LIMIT,
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.searchEvents.length === 0) {
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

    this.setState({
      loading: false
    });
  };

  handleEnd = (previousPosition, fetchMore) => {
    if (previousPosition === Waypoint.below) {
      this.setState(
        state => ({ skip: this.state.skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
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
      location
    } = this.state;
    const { t } = this.props;

    //TODO: Do we still need this
    sessionStorage.setItem(
      "searchEventQuery",
      JSON.stringify({
        lat,
        long,
        all,
        limit: LIMIT,
        maxDistance
      })
    );

    return (
      <div>
        <div>
          <Header t={t} />
          <section className="go-events">
            <SearchEventToolbar
              location={location}
              setLocationValues={this.setLocationValues}
              handleChangeSelect={e => this.handleChangeSelect(e)}
              reset={this.clearState}
              maxDistance={maxDistance}
              t={t}
            />
            <MyEvents t={t} />
            <Query
              query={SEARCH_EVENTS}
              variables={{ lat, long, maxDistance, all, limit: LIMIT }}
              fetchPolicy="cache-first"
            >
              {({ data, loading, error, fetchMore }) => {
                if (loading) {
                  return (
                    <Spinner page="searchEvents" title={t("upcomingevent")} />
                  );
                }
                if (
                  !data ||
                  !data.searchEvents ||
                  data.searchEvents.length === 0
                ) {
                  // <EmptyScreen message={t("noeventavailable")} />
                  return <div>{t("noeventavailable")}</div>;
                }

                return (
                  <EventsList
                    events={data.searchEvents}
                    handleEnd={previous => this.handleEnd(previous, fetchMore)}
                    t={t}
                  />
                );
              }}
            </Query>
          </section>
        </div>

        {event && (
          <ShareModal
            event={event}
            visible={shareModalVisible}
            close={() => this.setShareModalVisible(false)}
          />
        )}
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(withNamespaces("searchevents")(SearchEvents)))
);
