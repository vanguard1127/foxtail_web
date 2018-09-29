import React, { Component, Fragment } from "react";
import moment from "moment";

import { Query } from "react-apollo";
import { SEARCH_EVENTS } from "../../queries";
import EventCard from "./EventCard";

//TODO: fix moment date format issue
class SearchEvents extends Component {
  state = {
    currentDate: ""
  };

  handleEventCard = eventdate => {
    return (
      <div>
        <div>{moment(eventdate.date).format("dddd, MMMM Do YYYY")}</div>
        {eventdate.events.map(event => (
          <div key={event.id} style={{ marginLeft: "30vh" }}>
            <EventCard key={event.id} {...event} />
          </div>
        ))}
      </div>
    );
  };

  updateDate = date => {
    this.setState(() => {
      return {
        currentDate: moment(date).format("dddd, MMMM Do YYYY")
      };
    });
  };

  render() {
    return (
      <div>
        <h1>Events</h1>
        <Query query={SEARCH_EVENTS} variables={{ lat: -23.0, long: 73.0 }}>
          {({ data, loading, error }) => {
            if (loading) {
              return <div>Loading</div>;
            }
            if (error) {
              return (
                <div>
                  Error - Not Logged In
                  {error.message}
                </div>
              );
            }

            return (
              <Fragment>
                {data.searchEvents.docs.map(eventdate => {
                  return this.handleEventCard(eventdate);
                })}
              </Fragment>
            );
          }}
        </Query>
      </div>
    );
  }
}
export default SearchEvents;
