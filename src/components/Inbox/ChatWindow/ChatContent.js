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
      subscribeToMore,
      fetchMore,
      messages,
      limit
    } = this.props;

    return (
      <div
        className="content"
        style={{ display: "flex", flexDirection: " column-reverse" }}
        ref={node => {
          this.container = node;
        }}
      >
        <Messages
          chatID={chatID}
          currentUserID={currentUserID}
          t={t}
          messages={messages}
          fetchMore={fetchMore}
          subscribeToMore={subscribeToMore}
          dayjs={dayjs}
          lang={lang}
          ErrorHandler={ErrorHandler}
          limit={limit}
          container={this.container}
        />
      </div>
    );
  }
}

export default ChatContent;
