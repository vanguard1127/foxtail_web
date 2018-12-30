import React from "react";
import EventHeading from "./EventHeading";
import EventDate from "../common/EventDate";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

const EventHeader = ({
  event: { id, startTime, eventname, ownerProfile, createdAt }
}) => {
  return (
    <div className="header">
      <EventDate time={startTime} />
      <div className="info">
        <EventHeading eventname={eventname} />
        <EventCreator ownerProfile={ownerProfile} createdAt={createdAt} />
        <EventShare id={id} />
      </div>
    </div>
  );
};

export default EventHeader;
