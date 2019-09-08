import React, { PureComponent } from "react";
import Messages from "./Messages/";

class ChatContent extends PureComponent {
  render() {
    const {
      chatID,
      currentUserID,
      t,
      ErrorHandler,
      dayjs,
      lang,
      subscribeToMore,
      fetchMore,
      messages,
      limit
    } = this.props;

    return (
      <div
        className="content"
        style={{ display: "flex", flexDirection: " column-reverse" }}
      >
        <Messages
          chatID={chatID}
          currentUserID={currentUserID}
          ref={this.Messages}
          t={t}
          messages={messages}
          fetchMore={fetchMore}
          subscribeToMore={subscribeToMore}
          dayjs={dayjs}
          lang={lang}
          ErrorHandler={ErrorHandler}
          limit={limit}
        />
      </div>
    );
  }
}

export default ChatContent;
