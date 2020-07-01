import React from "react";

interface IEventTitles {
  eventname: string;
  tagline: string;
}

const EventTitles: React.FC<IEventTitles> = ({ eventname, tagline }) => {
  return (
    <>
      <span className="event-name">{eventname}</span>
      <span className="event-description">{tagline}</span>
    </>
  );
};

export default EventTitles;
