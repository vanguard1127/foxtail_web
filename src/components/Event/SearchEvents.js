import React, { Component, Fragment } from "react";
import moment from "moment";

import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import { Button, message } from "antd";
import AddEventModal from "./AddEventModal";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";
import MyEvents from "./MyEvents";
import Error from "../common/Error";
import Spinner from "../common/Spinner";

const LIMIT = 3;
//TODO: fix moment date format issue
class SearchEvents extends Component {
  state = {
    skip: 0,
    visible: false,
    blockModalVisible: false,
    shareModalVisible: false,
    event: null,
    lat: 0,
    long: 0,
    all: true
  };

  // if (!navigator.geolocation) {
  //   alert("Geolocation is not supported by this browser");
  // }
  // navigator.geolocation.getCurrentPosition(
  //   position => {
  //     console.log(position);
  //   },
  //   err => {
  //     alert("Unable to fetch location");
  //   }
  // );

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

  handleSubmit = (e, createEvent) => {
    e.preventDefault();

    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      // const dateTimeValue = fieldsValue["time"].format("YYYY-MM-DD HH:mm a");
      // const values = {
      //   ...fieldsValue,
      //   dateTimeValue
      // };
      // console.log("Received values of form: ", values);

      createEvent()
        .then(({ data }) => {
          this.props.history.push("/events/" + data.createEvent.id);
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });

          //TODO: send errors to analytics from here
          this.setState({ errors });
          message.warn(
            "An error has occured. We will have it fixed soon. Thanks for your patience."
          );
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
        //if there are events from last date in new fetch add them to old list
        if (
          previousResult.searchEvents[previousResult.searchEvents.length - 1]
            .date ===
          fetchMoreResult.searchEvents[fetchMoreResult.searchEvents.length - 1]
            .date
        ) {
          previousResult.searchEvents[
            previousResult.searchEvents.length - 1
          ].events = previousResult.searchEvents[
            previousResult.searchEvents.length - 1
          ].events.concat(
            fetchMoreResult.searchEvents[
              fetchMoreResult.searchEvents.length - 1
            ].events
          );
          //remove the pushed events from the fetch list
          fetchMoreResult.searchEvents.pop();
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
      lat,
      long,
      all
    } = this.state;

    const AddModalFrag = (
      <div
        style={{
          display: "flex",
          flex: "1",
          alignItems: "flex-end",
          flexDirection: "column"
        }}
      >
        {" "}
        <Button type="primary" onClick={this.showModal}>
          Add Event
        </Button>
        <AddEventModal
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          event={event}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );

    sessionStorage.setItem(
      "searchEventQuery",
      JSON.stringify({
        lat,
        long,
        all,
        limit: LIMIT
      })
    );

    return (
      <div>
        <MyEvents />
        {AddModalFrag}
        <Query
          query={SEARCH_EVENTS}
          variables={{ lat, long, all, limit: LIMIT }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading Events..." size="large" />;
            }

            if (error) {
              return <Error error={error} />;
            }
            if (!data.searchEvents || data.searchEvents.length === 0) {
              return <div>No Events Available</div>;
            }
            return (
              <div>
                <Fragment>
                  {data.searchEvents.map(eventdate => {
                    return this.handleEventCard(eventdate);
                  })}
                </Fragment>
                <Waypoint
                  onEnter={({ previousPosition }) =>
                    this.handleEnd(previousPosition, fetchMore)
                  }
                />
              </div>
            );
          }}
        </Query>
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

export default withRouter(SearchEvents);
