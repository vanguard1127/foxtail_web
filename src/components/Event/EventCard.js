import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import { DELETE_EVENT, SEARCH_EVENTS } from "../../queries";

const handleDelete = deleteEvent => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this event?"
  );
  if (confirmDelete) {
    deleteEvent().then(({ data }) => {
      console.log(data);
    });
  }
};
const EventCard = ({
  id,
  eventname,
  type,
  desires,
  sexes,
  lat,
  long,
  time,
  address,
  participants
}) => (
  <div>
    <table>
      <tbody>
        <tr>
          <td colSpan="3">
            <Mutation
              mutation={DELETE_EVENT}
              variables={{ eventID: id }}
              update={(cache, { data: { deleteEvent } }) => {
                const { searchEvents } = cache.readQuery({
                  query: SEARCH_EVENTS,
                  variables: { lat, long, desires }
                });

                cache.writeQuery({
                  query: SEARCH_EVENTS,
                  variables: { lat, long, desires },
                  data: {
                    searchEvents: searchEvents.filter(
                      event => event.id !== deleteEvent
                    )
                  }
                });
              }}
              refetchQueries={() => [
                { query: SEARCH_EVENTS, variables: { lat, long, desires } }
              ]}
            >
              {(deleteEvent, attrs = {}) => {
                return (
                  <p
                    className="delete-button"
                    onClick={() => handleDelete(deleteEvent)}
                    style={{ float: "right" }}
                  >
                    {attrs.loading ? "deleting..." : "X"}
                  </p>
                );
              }}
            </Mutation>
            <img alt="Event" src={require("../../images/party.jpg")} />
          </td>
        </tr>
        <tr>
          <td>
            <div style={{ float: "left" }}>
              {moment(time).format("hh:mm a")}
            </div>
          </td>
          <td>
            <div style={{ display: "block" }}>
              <Link to={`/event/${id}`}>{eventname}</Link>
              <br />
              {address}
              <br />
              Looking for:
              {desires}
              <br />
              {participants.length} attending
            </div>
          </td>
          <td>
            <div>
              <button>Open</button>
            </div>
            <div>
              <button>Flag</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default EventCard;
