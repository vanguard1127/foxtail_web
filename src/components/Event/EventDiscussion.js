import React, { Component } from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
const LIMIT = 4;
class EventDiscussion extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { chatID, history, t, ErrorHandler, dayjs, currentuser } = this.props;
    return (
      <ErrorHandler.ErrorBoundary>
        <div className="discuss-content">
          <span className="head">{t("discuss")}</span>
          <ChatPanel
            chatID={chatID}
            t={t}
            ErrorHandler={ErrorHandler}
            currentuser={currentuser}
            limit={LIMIT}
          />
          <ChatContent
            chatID={chatID}
            history={history}
            t={t}
            ErrorHandler={ErrorHandler}
            dayjs={dayjs}
            limit={LIMIT}
          />
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventDiscussion;
