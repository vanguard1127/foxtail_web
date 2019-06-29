import React, { Component } from "react";
import Message from "./Message.js";
import { Waypoint } from "react-waypoint";

class MessageList extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.messages.length !== nextProps.messages.length ||
      this.props.loading !== nextProps.loading ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      messages,
      history,
      dayjs,
      handleEnd,
      fetchMore,
      loading,
      t,
      lang
    } = this.props;

    if (messages.length === 0) {
      return (
        <div className="item" style={{ textAlign: "center" }}>
          {t("nocomm")}
        </div>
      );
    }

    const messageElements = messages.map(message => {
      return (
        <Message
          key={message.id}
          message={message}
          history={history}
          dayjs={dayjs}
          lang={lang}
        />
      );
    });

    return (
      <div className="messages">
        {messageElements}
        <div
          className="item"
          style={{ padding: "0px", position: "absolute", bottom: "0%" }}
        >
          <Waypoint
            onEnter={({ previousPosition, currentPosition }) =>
              handleEnd({
                previousPosition,
                currentPosition,
                fetchMore,
                cursor: messages && messages[messages.length - 1].createdAt
              })
            }
          />
        </div>
        {loading ? (
          <div className="item">
            <span> {t("common:Loading")}</span>
          </div>
        ) : (
          <div className="item" style={{ textAlign: "center" }}>
            {t("nomocomm")}
          </div>
        )}
      </div>
    );
  }
}
export default MessageList;
