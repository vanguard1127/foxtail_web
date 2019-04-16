import React from "react";
const EventTitles = ({ eventname, tagline, showBlockModal }) => {
  return (
    <>
      <span className="report" onClick={showBlockModal} />
      <span className="event-name">{eventname}</span>
      <span className="event-description">{tagline}</span>
    </>
  );
};

export default EventTitles;
