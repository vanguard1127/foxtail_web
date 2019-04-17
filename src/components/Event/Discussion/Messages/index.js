import React, { Component } from "react";
import Message from "./Message.js";
import { Waypoint } from "react-waypoint";

class MessageList extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.messages.length !== nextProps.messages.length ||
      this.props.loading !== nextProps.loading
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
      t
    } = this.props;

    if (messages.length === 0) {
      return <div>No messages yet</div>;
    }

    const messageElements = messages.map(message => {
      return (
        <Message
          key={message.id}
          message={message}
          history={history}
          dayjs={dayjs}
        />
      );
    });

    return (
      <div className="messages">
        {messageElements}
        <div
          className="item"
          style={{ padding: "0px", position: "absolute", bottom: "20%" }}
        >
          <Waypoint
            onEnter={({ previousPosition }) =>
              handleEnd({
                previousPosition,
                fetchMore,
                cursor: messages && messages[messages.length - 1].createdAt
              })
            }
          />
        </div>
        {loading ? (
          <div className="item">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="item" style={{ textAlign: "center" }}>
            No more messages.
          </div>
        )}
      </div>
    );
  }
}
export default MessageList;
