import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messagesEnd = React.createRef();
  }
  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }
  scrollToBot() {
    this.messagesEnd.current.scrollTop = this.messagesEnd.current.scrollHeight;
  }
  render() {
    const { data, fetchMore, handleEnd } = this.props;
    return (
      <Fragment>
        <Waypoint
          onEnter={({ previousPosition }) =>
            handleEnd(
              previousPosition,
              fetchMore,
              data.getMessages.messages[data.getMessages.messages.length - 1]
                .createdAt
            )
          }
        />
        <div className="chats" ref={this.messagesEnd}>
          {data.getMessages.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </Fragment>
    );
  }
}
export default MessageList;
