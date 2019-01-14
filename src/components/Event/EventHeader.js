import React from "react";
import EventTitles from "./EventTitles";
import EventDate from "../common/Event/EventDate";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

const EventHeader = ({
  event: { id, startTime, eventname, ownerProfile, createdAt },
  history,
  t
}) => {
  return (
    <div className="header">
      <EventDate time={startTime} />
      <div className="info">
        <EventTitles eventname={eventname} />
        <EventCreator
          ownerProfile={ownerProfile}
          createdAt={createdAt}
          history={history}
          t={t}
        />
        <EventShare id={id} t={t} />
      </div>
    </div>
  );
};

export default EventHeader;
