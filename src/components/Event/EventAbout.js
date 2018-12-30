import React from "react";
import GoingBar from "./GoingBar";

const EventAbout = ({ id, participants, description }) => {
  return (
    <div className="about-event-content">
      <p>{description}</p>
      <GoingBar id={id} participants={participants} />
    </div>
  );
};

export default EventAbout;
