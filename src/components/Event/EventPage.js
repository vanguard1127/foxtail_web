import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_EVENT } from "../../queries";
import AttendEvent from "./AttendEvent";

const EventPage = ({ match }) => {
  const { id } = match.params;
  return (
    <Query query={GET_EVENT} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <div>Loading</div>;
        }
        if (error) {
          return <div>Error</div>;
        }

        return (
          <div className="App">
            <h2>{data.event.eventname}</h2>
            <p>{data.event.time}</p>
            <p>
              Going:
              {data.event.participants.length}
            </p>
            <AttendEvent
              id={data.event.id}
              participants={data.event.participants}
            />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(EventPage);
