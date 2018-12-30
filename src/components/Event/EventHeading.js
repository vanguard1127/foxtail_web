import React from "react";
const EventHeading = ({ eventname }) => {
  return (
    <div>
      {" "}
      <span className="event-name">{eventname}</span>
      <span className="event-description">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.{" "}
      </span>
    </div>
  );
};

export default EventHeading;
