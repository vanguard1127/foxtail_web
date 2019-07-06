import React, { Component } from "react";
import EventTitles from "./EventTitles";
import EventDate from "../../common/Event/EventDate";
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
      ErrorHandler,
      lang,
      ReactGA
    } = this.props;

    return (
      <ErrorHandler.ErrorBoundary>
        <div className="header">
          <EventDate time={startTime} dayjs={dayjs} lang={lang} />
          <div className="info">
            <EventTitles eventname={eventname} tagline={tagline} />
            <EventCreator
              ownerProfile={ownerProfile}
              createdAt={createdAt}
              history={history}
              t={t}
              dayjs={dayjs}
              lang={lang}
            />
            <EventShare
              id={id}
              t={t}
              showShareModal={showShareModal}
              showBlockModal={showBlockModal}
              ErrorHandler={ErrorHandler}
              ReactGA={ReactGA}
            />
          </div>
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventHeader;
