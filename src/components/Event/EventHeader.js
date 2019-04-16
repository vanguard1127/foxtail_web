import React, { Component } from "react";
import EventTitles from "./EventTitles";
import EventDate from "../common/Event/EventDate";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

class EventHeader extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { event: eventProps } = this.props;
    const { event: nextEventProps } = nextProps;

    if (
      eventProps.startTime !== nextEventProps.startTime ||
      eventProps.eventname !== nextEventProps.eventname ||
      eventProps.tagline !== nextEventProps.tagline ||
      eventProps.ownerProfile !== nextEventProps.ownerProfile ||
      eventProps.createdAt !== nextEventProps.createdAt
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      event: { id, startTime, eventname, ownerProfile, createdAt, tagline },
      history,
      t,
      dayjs,
      showShareModal,
      showBlockModal,
      ErrorBoundary
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="header">
          <EventDate time={startTime} dayjs={dayjs} />
          <div className="info">
            <EventTitles
              eventname={eventname}
              tagline={tagline}
              showBlockModal={showBlockModal}
            />
            <EventCreator
              ownerProfile={ownerProfile}
              createdAt={createdAt}
              history={history}
              t={t}
              dayjs={dayjs}
            />
            <EventShare id={id} t={t} showShareModal={showShareModal} />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default EventHeader;
