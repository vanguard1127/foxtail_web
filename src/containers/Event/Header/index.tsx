import React from "react";

import EventDate from "components/common/EventDate";

import EventTitles from "./EventTitles";
import EventCreator from "./EventCreator";
import EventShare from "./EventShare";

interface IEventHeaderProps {
  event: any;
  history: any;
  t: any;
  dayjs: any;
  showShareModal: any;
  showBlockModal: any;
  ErrorHandler: any;
  ReactGA: any;
  lang: string;
}

const EventHeader: React.FC<IEventHeaderProps> = ({
  event: { id, startTime, eventname, ownerProfile, createdAt, tagline },
  history,
  t,
  dayjs,
  showShareModal,
  showBlockModal,
  ErrorHandler,
  lang,
  ReactGA
}) => {
  return (
    <ErrorHandler.ErrorBoundary>
      <div className="header">
        <EventDate time={startTime} lang={lang} />
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
          <div className="report-con">
            <span className="rep-text">{t("reportlbl")}</span>
            <span className="report" onClick={showBlockModal} />
          </div>
        </div>
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default EventHeader;
