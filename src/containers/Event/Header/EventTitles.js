import React from "react";
const EventTitles = ({ eventname, tagline }) => {
  return (
    <>
      <span className="event-name">{eventname}</span>
      <span className="event-description">{tagline}</span>
    </>
  );
};

export default EventTitles;
