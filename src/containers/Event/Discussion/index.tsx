import React from "react";
import { WithT } from "i18next";

import * as ErrorHandler from "components/common/ErrorHandler";

import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";

interface IEventDiscussionProps extends WithT {
  chatID: string;
  history: any;
  dayjs: any;
  lang: string;
}

const EventDiscussion: React.FC<IEventDiscussionProps> = ({
  chatID,
  history,
  dayjs,
  lang,
  t,
}) => {
  return (
    <ErrorHandler.ErrorBoundary>
      <div className="discuss-content">
        <span className="head">{t("discuss")}</span>
        <ChatPanel
          chatID={chatID}
          t={t}
        />
        <ChatContent
          chatID={chatID}
          history={history}
          t={t}
          dayjs={dayjs}
          limit={parseInt(process.env.REACT_APP_EVENTDISC_LIMIT)}
          lang={lang}
        />
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default EventDiscussion;
