import React, { Component } from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
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
          />
          <ChatContent
            chatID={chatID}
            history={history}
            t={t}
            ErrorHandler={ErrorHandler}
            dayjs={dayjs}
          />
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default EventDiscussion;
