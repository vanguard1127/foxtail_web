import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_MY_EVENTS } from "../../queries";
import { EventLoader } from "../common/Skeletons";
import EventCard from "./EventCard";

const LIMIT = 3;

class MyEvents extends Component {
  state = { skip: 0, current: 1 };

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
    const { t } = this.props;
    return (
      <Query
        query={GET_MY_EVENTS}
        variables={{ skip }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return (
              <div className="events-card-content my-events">
                <div className="container">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12">
                        <span className="head">{t("myevents")}</span>
                      </div>
                      <div className="col-md-12 col-lg-6" key={"1"}>
                        <div className="card-item">
                          <EventLoader />
                        </div>
                      </div>
                      <div className="col-md-12 col-lg-6" key={"2"}>
                        <div className="card-item">
                          <EventLoader />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
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
                      <span className="head">{t("myevents")}</span>
                    </div>

                    {myEvents.map(event => (
                      <EventCard key={event.id} event={event} t={t} />
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