import React, { Component, Fragment } from "react";
import moment from "moment";

import { withRouter } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import { Button } from "antd";
import AddEventModal from "./AddEventModal";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";

const LIMIT = 3;
//TODO: fix moment date format issue
class SearchEvents extends Component {
  state = {
    currentDate: "",
    skip: 0,
    loading: false,
    visible: false,
    blockModalVisible: false,
    shareModalVisible: false,
    event: {}
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

  setShareModalVisible = (shareModalVisible, event) => {
    if (event) this.setState({ event, shareModalVisible });
    else this.setState({ shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, event) => {
    if (event) this.setState({ event, blockModalVisible });
    else this.setState({ blockModalVisible });
  };

  handleSubmit = (e, createEvent) => {
    e.preventDefault();

    this.formRef.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const dateTimeValue = fieldsValue["time"].format("YYYY-MM-DD HH:mm a");
      const values = {
        ...fieldsValue,
        dateTimeValue
      };
      console.log("Received values of form: ", values);

      createEvent()
        .then(({ data }) => {
          this.props.history.push("/events/" + data.createEvent.id);
        })
        .catch(e => console.log(e.message));
    });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  handleCancel = () => {
    this.setState({ event: {}, visible: false });
  };

  fetchData = async () => {
    this.setState({ loading: true });
    this.props.data.fetchMore({
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

  handleEnd = () => {
    this.setState(
      state => ({ skip: this.state.skip + LIMIT }),
      () => this.fetchData()
    );
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
              handleEdit={this.handleEdit}
            />
          </div>
        ))}
      </div>
    );
  };

  render() {
    const {
      event,
      loading,
      visible,
      blockModalVisible,
      shareModalVisible
    } = this.state;
    //TODO: Catch errors here
    if (loading || this.props.data.searchEvents === undefined) {
      return <div>loading</div>;
    }
    const data = this.props.data.searchEvents;

    return (
      <div>
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
        </div>
        <Fragment>
          {data.map(eventdate => {
            return this.handleEventCard(eventdate);
          })}
        </Fragment>
        <Waypoint onEnter={this.handleEnd} />
        <AddEventModal
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          event={event}
          handleSubmit={this.handleSubmit}
        />
        <BlockModal
          event={event}
          id={event.id}
          visible={blockModalVisible}
          close={() => this.setBlockModalVisible(false)}
        />
        <ShareModal
          event={event}
          visible={shareModalVisible}
          close={() => this.setShareModalVisible(false)}
        />
      </div>
    );
  }
}

export default withRouter(
  compose(
    graphql(SEARCH_EVENTS, {
      options(ownProps) {
        return {
          variables: { long: 73.0, lat: -23.0, limit: LIMIT }
        };
      }
    })
  )(SearchEvents)
);
