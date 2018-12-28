import React from "react";
import EventCard from "./EventCard";
const EventsList = ({ events }) => {
  return (
    <div className="events-card-content">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <span className="head">Oncoming Events</span>
            </div>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
            <div className="col-md-12">
              <div className="more-content-btn">
                <a href="#">More Events</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
