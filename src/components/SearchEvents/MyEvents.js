import React, { Component } from "react";
import { Collapse } from "antd";
import { Card, Pagination } from "antd";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_MY_EVENTS } from "../../queries";
import moment from "moment";
import Spinner from "../common/Spinner";
import EventCard from "./EventCard";

const LIMIT = 3;

class MyEvents extends Component {
  state = { skip: 0, current: 1 };

  events = data => (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around"
        }}
      >
        {data.getMyEvents.docs.map(item => (
          <div
            key={item.id}
            style={{
              width: "30%"
            }}
          >
            <Card
              title={
                <a
                  onClick={() => this.props.history.push("/events/" + item.id)}
                >
                  {item.eventname}
                </a>
              }
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column"
              }}
            >
              <div>
                Date:
                {moment(item.time).format("MMM DD YYYY")}{" "}
              </div>
              <div>
                {" "}
                Time:
                {moment(item.time).format("hh:mm a")}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  fetchData = fetchMore => {
    this.setState({ loading: true });
    fetchMore({
      variables: {
        skip: this.state.skip
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.getMyEvents.docs.length === 0) {
          return previousResult;
        }

        return {
          getMyEvents: { ...fetchMoreResult.getMyEvents }
        };
      }
    });
  };

  handlePaginate = (page, fetchMore) => {
    this.setState(
      state => ({
        skip: (page - 1) * LIMIT,
        current: page
      }),
      () => this.fetchData(fetchMore)
    );
  };
  render() {
    const { skip, current } = this.state;
    return (
      <Query
        query={GET_MY_EVENTS}
        variables={{ skip }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return <Spinner message="Loading My Events..." size="small" />;
          }

          if (!data.getMyEvents || data.getMyEvents.docs.length === 0) {
            return null;
          }
          const myEvents = data.getMyEvents.docs;
          return (
            <div className="events-card-content my-events">
              <div className="container">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <span className="head">My Events</span>
                    </div>

                    {myEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default withRouter(MyEvents);
