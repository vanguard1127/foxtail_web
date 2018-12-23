import React, { Component, Fragment } from "react";
import { Badge, Avatar, List, Divider } from "antd";
import TimeAgo from "../../utils/TimeAgo";

class InboxList extends Component {
  state = { chatID: null };

  renderItem = (item, timeAgo, isCurrentChat) => {
    const { currentUserID } = this.props;
    let title;
    if (item.fromUser.id === currentUserID && item.participants.length > 0) {
      title = item.participants[0].profileName;
    } else {
      title = item.fromUser.username;
    }
    return (
      <List.Item
        key={item.id}
        style={{
          backgroundColor: isCurrentChat ? "#ffffff40" : "",

          margin: "0 -10px",
          paddingLeft: "10px",
          paddingRight: "10px"
        }}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={timeAgo === "Online"}>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </Badge>
          }
          title={
            <a onClick={e => this.props.setChatID(e, item.chatID)}>{title}</a>
          }
          description={item.text}
        />
        <div>{timeAgo}</div>
      </List.Item>
    );
  };

  renderMsgList = ({ messages, onlineOnly }) => {
    return (
      <Fragment>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.createdAt);
          let isCurrentChat = false;
          if (this.state.chatID === message.chatID) {
            isCurrentChat = true;
          } else if (!this.state.chatID) {
            isCurrentChat = i === 0;
          }
          if (onlineOnly) {
            if (timeAgo === "Online") {
              return this.renderItem(message, timeAgo, isCurrentChat);
            }
            return null;
          } else if (timeAgo !== "Online") {
            return this.renderItem(message, timeAgo, isCurrentChat);
          }
          return null;
        })}
      </Fragment>
    );
  };

  //Variables by text
  render() {
    const { messages } = this.props;
    return (
      <Fragment>
        <Divider className="chatList-divider" orientation="left">
          Online
        </Divider>
        {this.renderMsgList({ messages, onlineOnly: true })}
        <Divider />
        {this.renderMsgList({ messages, onlineOnly: false })}
        {/* <Waypoint
                onEnter={({ previousPosition }) =>
                  this.handleEnd(previousPosition, fetchMore)
                }
              /> */}
      </Fragment>
    );
  }
}

export default InboxList;
