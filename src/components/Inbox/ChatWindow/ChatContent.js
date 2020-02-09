import React, { PureComponent } from "react";
import Messages from "./Messages/";

class ChatContent extends PureComponent {
  container;
  render() {
    const {
      chatID,
      currentUserID,
      t,
      ErrorHandler,
      dayjs,
      lang,
      fetchMore,
      messages,
      limit,
      subscribeToMore,
      typingText
    } = this.props;

    return (
      <div
        className="content"
        style={{
          display: "flex",
          flexDirection: " column-reverse"
        }}
      >
        <Messages
          chatID={chatID}
          currentUserID={currentUserID}
          t={t}
          messages={messages}
          fetchMore={fetchMore}
          dayjs={dayjs}
          lang={lang}
          ErrorHandler={ErrorHandler}
          limit={limit}
          subscribeToMore={subscribeToMore}
          typingText={typingText}
        />
      </div>
    );
  }
}

export default ChatContent;
