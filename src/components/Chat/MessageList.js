import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";
import { message } from "antd";
import { moment } from "moment";

class MessageList extends Component {
  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }
  scrollToBot() {
    this.props.messagesRef.current.scrollTop = this.props.messagesRef.current.scrollHeight;
  }

  UNSAFE_componentWillReceiveProps({ messages }) {
    if (
      this.props.messagesRef &&
      this.props.messagesRef.current.scrollTop < 100 &&
      this.props.messages &&
      messages &&
      this.props.messages.length !== messages.length
    ) {
      // 35 items
      const heightBeforeRender = this.props.messagesRef.current.scrollHeight;
      // wait for 70 items to render
      setTimeout(() => {
        this.props.messagesRef.current.scrollTop =
          this.props.messagesRef.current.scrollHeight - heightBeforeRender;
      }, 120);
    }
  }
  info = () => {
    message.info(
      moment(
        this.props.messages[this.props.messages.length - 1].createdAt
      ).format("dddd, MMMM Do YYYY")
    );
  };
  render() {
    const { messages, fetchMore, handleEnd, messagesRef } = this.props;
    return (
      <Fragment>
        <div
          className="chats"
          ref={messagesRef}
          style={{ backgroundColor: "#eee" }}
        >
          <Waypoint
            onEnter={({ previousPosition, currentPosition }) =>
              handleEnd(
                previousPosition,
                currentPosition,
                fetchMore,
                messages[messages.length - 1].createdAt
              )
            }
          />
          {[...messages].reverse().map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </Fragment>
    );
  }
}
export default MessageList;
