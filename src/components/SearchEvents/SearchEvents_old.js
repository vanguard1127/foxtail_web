import React, { Component, Fragment } from "react";
import moment from "moment";

import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
import { Button, message, BackTop, Input, Select, Tooltip } from "antd";
import BlockModal from "../common/BlockModal";
import ShareModal from "../Modals/Share";
import MyEvents from "./MyEvents";
import Spinner from "../common/Spinner";
import withLocation from "../withLocation";
import withAuth from "../withAuth";
import AddressSearch from "../common/AddressSearch";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
const Option = Select.Option;

const LIMIT = 3;
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
    city: "My Location",
    all: true
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

  handleChangeSelect = value => {
    this.setState({ maxDistance: value });
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

  handleTextChange = city => {
    this.setState({ city });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        return getLatLng(results[0]);
      })
      .then(latLng => {
        this.setState({
          lat: latLng.lat,
          long: latLng.lng,
          city: address
        });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
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
      city
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
      </div>
    );

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
        <MyEvents />
        {AddModalFrag}
        <Query
          query={SEARCH_EVENTS}
          variables={{ lat, long, maxDistance, all, limit: LIMIT }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading Events..." size="large" />;
            }
            if (!data.searchEvents || data.searchEvents.length === 0) {
              return <div>No Events Available</div>;
            }
            let LocationInput;
            if (true) {
              LocationInput = (
                <AddressSearch
                  style={{ width: 150 }}
                  onSelect={this.handleSelect}
                  onChange={this.handleTextChange}
                  value={city}
                  type={"(cities)"}
                />
              );
            } else {
              LocationInput = (
                <Tooltip title="Black Members only">
                  <Input
                    style={{ width: 150 }}
                    placeholder="My Location"
                    disabled
                  />
                </Tooltip>
              );
            }
            return (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  <span style={{ marginRight: "1vw" }}>Events located</span>
                  <Select
                    style={{ width: 220 }}
                    onChange={this.handleChangeSelect}
                    value={maxDistance}
                  >
                    <Option value={5}>5 miles</Option>
                    <Option value={10}>10 miles</Option>
                    <Option value={20}>20 miles</Option>
                    <Option value={50}>50 miles</Option>
                    <Option value="all" disabled>
                      <Tooltip title="Black Members only">
                        <span>Everywhere.</span>
                      </Tooltip>
                    </Option>
                  </Select>
                  <span style={{ marginRight: "1vw", marginLeft: "1vw" }}>
                    from
                  </span>
                  {LocationInput}
                </div>
                <BackTop />
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

export default withAuth(session => session && session.currentuser)(
  withRouter(withLocation(SearchEvents))
);
