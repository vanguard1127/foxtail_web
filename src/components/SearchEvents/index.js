import React, { Component, Fragment } from "react";
import moment from "moment";

import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import { Button, message, BackTop, Input, Select, Tooltip } from "antd";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";
import MyEvents from "./MyEvents";
import Spinner from "../common/Spinner";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import SearchEventToolbar from "./SearchEventToolbar";
import Header from "./Header";
import EventsList from "./EventsList";

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
    e.preventDefault();
    this.setState({ maxDistance: parseInt(e.target.value) });
  };

  setLocationValues = ({ lat, long, address }) => {
    if (lat && long) {
      this.setState({ lat, long, location: address });
    } else {
      this.setState({ location: address });
    }
  };

  handleSubmit = (e, createEvent) => {
    e.preventDefault();
    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      createEvent()
        .then(({ data }) => {
          message.success("Event created successfully! Share to get attendees");
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
        console.log(previousResult, fetchMoreResult);
        if (!fetchMoreResult || fetchMoreResult.searchEvents.length === 0) {
          return previousResult;
        }
        //if there are events from last date in new fetch add them to old list
        // if (
        //   previousResult.searchEvents[previousResult.searchEvents.length - 1]
        //     .date ===
        //   fetchMoreResult.searchEvents[fetchMoreResult.searchEvents.length - 1]
        //     .date
        // ) {
        //   previousResult.searchEvents[
        //     previousResult.searchEvents.length - 1
        //   ].events = previousResult.searchEvents[
        //     previousResult.searchEvents.length - 1
        //   ].events.concat(
        //     fetchMoreResult.searchEvents[
        //       fetchMoreResult.searchEvents.length - 1
        //     ].events
        //   );
        //   //remove the pushed events from the fetch list
        //   fetchMoreResult.searchEvents.pop();
        // }

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
    console.log(previousPosition);
    if (previousPosition === Waypoint.below) {
      this.setState(
        state => ({ skip: this.state.skip + LIMIT }),
        () => this.fetchData(fetchMore)
      );
    }
  };

  handleEventCard = eventdate => {
    return (
      <div key={eventdate.date}>
        <div>{moment(eventdate.date).format("dddd, MMMM Do YYYY")}</div>
        {eventdate.events.map(event => (
          <div key={event.id} style={{ marginLeft: "30vh" }}>
            <EventCard
              key={event.id}
              event={event}
              showBlockModal={this.setBlockModalVisible}
              showShareModal={this.setShareModalVisible}
            />
          </div>
        ))}
      </div>
    );
  };

  render() {
    const {
      event,
      visible,
      blockModalVisible,
      shareModalVisible,
      all,
      lat,
      long,
      maxDistance,
      location
    } = this.state;

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
          <Header />
          <section className="go-events">
            <SearchEventToolbar
              location={location}
              setLocationValues={this.setLocationValues}
              handleChangeSelect={e => this.handleChangeSelect(e)}
              reset={this.clearState}
              maxDistance={maxDistance}
            />
            <MyEvents />
            <Query
              query={SEARCH_EVENTS}
              variables={{ lat, long, maxDistance, all, limit: LIMIT }}
              fetchPolicy="cache-first"
            >
              {({ data, loading, error, fetchMore }) => {
                if (loading) {
                  return <Spinner message="Loading Events..." size="large" />;
                }
                if (
                  !data ||
                  !data.searchEvents ||
                  data.searchEvents.length === 0
                ) {
                  return <div>No Events Available</div>;
                }

                return (
                  <EventsList
                    events={data.searchEvents}
                    handleEnd={previous => this.handleEnd(previous, fetchMore)}
                  />
                );
              }}
            </Query>
          </section>
        </div>

        {event && (
          <BlockModal
            event={event}
            id={event.id}
            visible={blockModalVisible}
            close={() => this.setBlockModalVisible(false)}
          />
        )}
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
  withRouter(withLocation(SearchEvents))
);
