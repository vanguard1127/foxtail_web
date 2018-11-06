import React, { Component, Fragment } from "react";
import { List } from "antd";
import Waypoint from "react-waypoint";
import Message from "./Message.js";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messagesEnd = React.createRef();
  }
  componentDidMount() {
    // console.log("div", this.messagesEnd.scrollTop);
  }
  scrollToBot() {
    console.log("div", this.messagesEnd.current);
    //this.messagesEnd.current.scrollTop = 100;
  }
  render() {
    const { data, fetchMore, handleEnd } = this.props;
    return (
      <Fragment ref={this.messagesEnd}>
        <a onClick={() => this.scrollToBot()}>Test Scroll</a>
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
        <List className="chats" ref={this.messagesEnd}>
          {data.getMessages.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
          <List.Item />
        </List>
      </Fragment>
    );
  }
}
export default MessageList;
