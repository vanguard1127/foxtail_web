import React from "react";

interface IEventTitles {
  eventname: string;
  tagline: string;
}

const EventTitles: React.FC<IEventTitles> = ({ eventname, tagline }) => {
  return (
    <React.Fragment>
      <span className="event-name">{eventname}</span>
      <span className="event-description">{tagline}</span>
    </React.Fragment>
  );
};

export default EventTitles;
