import React, { Component, Fragment } from "react";
import moment from "moment";

import { graphql, compose } from "react-apollo";
import { SEARCH_EVENTS, CREATE_EVENT } from "../../queries";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import { Button } from "antd";
import AddEventModal from "./AddEventModal";

const LIMIT = 3;
//TODO: fix moment date format issue
class SearchEvents extends Component {
  state = {
    currentDate: "",
    skip: 0,
    loading: false,
    visible: false
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

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);
      const response = await this.props.createEvent({
        variables: {
          ...values
        }
      });
      console.log("Response", response);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
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
            <EventCard key={event.id} {...event} />
          </div>
        ))}
      </div>
    );
  };

  render() {
    //TODO: Catch errors here
    if (this.state.loading || this.props.data.searchEvents === undefined) {
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
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default compose(
  graphql(SEARCH_EVENTS, {
    options(ownProps) {
      return {
        variables: { long: 73.0, lat: -23.0, limit: LIMIT }
      };
    }
  }),
  graphql(CREATE_EVENT, { name: "createEvent" })
)(SearchEvents);

// export default compose(
//    graphql(queries.getSubjects, {
//       name: "subjectsQuery"
//    }),
//    graphql(queries.getApps, {
//       name: "appsQuery"
//    }),
// )(Test);
