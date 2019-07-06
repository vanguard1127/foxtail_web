import React, { Component } from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
import { EVENTDISC_LIMIT } from "../../../docs/consts";
class EventDiscussion extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const {
      chatID,
      history,
      t,
      ErrorHandler,
      dayjs,
      currentuser,
      lang,
      ReactGA
    } = this.props;
    return (
      <ErrorHandler.ErrorBoundary>
        <div className="discuss-content">
          <span className="head">{t("discuss")}</span>
          <ChatPanel
            chatID={chatID}
            t={t}
            ErrorHandler={ErrorHandler}
            currentuser={currentuser}
            limit={EVENTDISC_LIMIT}
            ReactGA={ReactGA}
          />
          <ChatContent
            chatID={chatID}
            history={history}
            t={t}
            ErrorHandler={ErrorHandler}
            dayjs={dayjs}
            limit={EVENTDISC_LIMIT}
            lang={lang}
          />
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventDiscussion;
