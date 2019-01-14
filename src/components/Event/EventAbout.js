import React from "react";
import GoingBar from "./GoingBar";

const EventAbout = ({ id, participants, description, t }) => {
  return (
    <div className="about-event-content">
      <p>{description}</p>
      <GoingBar id={id} participants={participants} t={t} />
    </div>
  );
};

export default EventAbout;
