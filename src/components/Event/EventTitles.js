import React from 'react';
const EventTitles = ({ eventname, tagline }) => {
  return (
    <div>
      <span className="event-name">{eventname}</span>
      <span className="event-description">{tagline}</span>
    </div>
  );
};

export default EventTitles;
