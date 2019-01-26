import React, { Component, Fragment } from "react";
import TimeAgo from "../../utils/TimeAgo";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
class InboxList extends Component {
  state = { chatID: null };

  renderItem = (item, timeAgo, isCurrentChat) => {
    const { currentUserID, readChat } = this.props;
    let title;
    if (item.fromUser.id === currentUserID && item.participants.length > 0) {
      title = item.participants[0].profileName;
    } else {
      title = item.fromUser.username;
    }

    return (
      <div className="item unread" key={item.id}>
        <span onClick={() => readChat(item.chatID, item.unSeenCount)}>
          <span className="img">
            <img
              src={
                item.profilePic !== ""
                  ? item.profilePic
                  : "assets/img/usr/avatar/1001@2x.png"
              }
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div className="data">
            <span className="name">{title}</span>
            <span className="time">{timeAgo}</span>
            <span className="msg">{item.text}</span>
            {item.unSeenCount !== 0 && (
              <span className="notif">{item.unSeenCount}</span>
            )}
          </div>
        </span>
      </div>
    );
  };

  renderMsgList = ({ messages }) => {
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

          return this.renderItem(message, timeAgo, isCurrentChat);
        })}
      </Fragment>
    );
  };

  //Variables by text
  render() {
    const { messages } = this.props;
    return (
      <div className="conversations">
        {this.renderMsgList({ messages })}

        {/* <Waypoint
      //           onEnter={({ previousPosition }) =>
      //             this.handleEnd(previousPosition, fetchMore)
      //           }
      //         /> */}
      </div>
    );
  }
}

export default InboxList;
