import React from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";

interface IEventDiscussionProps {
  chatID: string;
  history: any;
  t: any;
  ErrorHandler: any;
  dayjs: any;
  lang: string;
  ReactGA: any;
}

const EventDiscussion: React.FC<IEventDiscussionProps> = ({
  chatID,
  history,
  t,
  ErrorHandler,
  dayjs,
  lang,
  ReactGA
}) => {
  return (
    <ErrorHandler.ErrorBoundary>
      <div className="discuss-content">
        <span className="head">{t("discuss")}</span>
        <ChatPanel
          chatID={chatID}
          t={t}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
        />
        <ChatContent
          chatID={chatID}
          history={history}
          t={t}
          ErrorHandler={ErrorHandler}
          dayjs={dayjs}
          limit={parseInt(process.env.REACT_APP_EVENTDISC_LIMIT)}
          lang={lang}
        />
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default EventDiscussion;
