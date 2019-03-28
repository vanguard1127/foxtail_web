import React, { PureComponent } from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
class EventDiscussion extends PureComponent {
  render() {
    const {
      id,
      chatID,
      history,
      t,
      ErrorHandler,
      dayjs,
      currentuser
    } = this.props;
    return (
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
    );
  }
}

export default EventDiscussion;
