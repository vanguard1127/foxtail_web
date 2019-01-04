import React from "react";
import EventHeading from "./EventHeading";
import EventDate from "../common/Event/EventDate";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

const EventHeader = ({
  event: { id, startTime, eventname, ownerProfile, createdAt },
  history
}) => {
  return (
    <div className="header">
      <EventDate time={startTime} />
      <div className="info">
        <EventHeading eventname={eventname} />
        <EventCreator
          ownerProfile={ownerProfile}
          createdAt={createdAt}
          history={history}
        />
        <EventShare id={id} />
      </div>
    </div>
  );
};

export default EventHeader;
