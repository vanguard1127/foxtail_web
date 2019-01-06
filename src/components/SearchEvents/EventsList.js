import React from "react";
import EventCard from "./EventCard";
import Waypoint from "react-waypoint";
const EventsList = ({ events, handleEnd }) => {
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
            <Waypoint
              onEnter={({ previousPosition }) => handleEnd(previousPosition)}
            />
            <div className="col-md-12">
              <div className="more-content-btn">
                <a href="#">No More Events</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
