import React from "react";
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
const EventItem = ({
  id,
  eventname,
  type,
  description,
  desires,
  sexes,
  lat,
  long,
  time
}) => (
  <li>
    <Link to={`/event/${id}`}>{eventname}</Link>
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
            searchEvents: searchEvents.filter(event => event.id !== deleteEvent)
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
          >
            {attrs.loading ? "deleting..." : "X"}
          </p>
        );
      }}
    </Mutation>
  </li>
);

export default EventItem;
