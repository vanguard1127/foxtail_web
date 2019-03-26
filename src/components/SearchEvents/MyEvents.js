import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_MY_EVENTS } from "../../queries";
import EventCard from "./EventCard";

//TODO: APPLY SHOULD RERENDER
class MyEvents extends PureComponent {
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

  render() {
    const { t, ErrorHandler, dayjs } = this.props;
    return (
      <Query query={GET_MY_EVENTS} fetchPolicy="cache-and-network">
        {({ data, loading, error, fetchMore }) => {
          if (loading) {
            return null;
          }
          if (error) {
            return (
              <ErrorHandler.report error={error} calledName={"getMyEvents"} />
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
                      <EventCard
                        key={event.id}
                        event={event}
                        t={t}
                        dayjs={dayjs}
                      />
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
