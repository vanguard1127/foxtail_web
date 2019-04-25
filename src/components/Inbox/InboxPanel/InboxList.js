import React, { PureComponent, Fragment } from "react";
import { Waypoint } from "react-waypoint";
import TimeAgo from "../../../utils/TimeAgo";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
class InboxList extends PureComponent {
  state = { chatID: null };

  renderItem = (item, timeAgo) => {
    const { currentuser, readChat } = this.props;

    let title;
    console.log("OTLTL", item);
    if (item.type === "alert" || item.type === "left") {
      title = "Foxtail";
    } else {
      if (item.fromUser) {
        if (
          item.fromUser.id === currentuser.userID &&
          item.participants.length > 0
        ) {
          title = item.participants[0].profileName;
        } else {
          title = item.fromUser.username;
        }
        let notME = item.participants.filter(
          el => el.id.toString() !== currentuser.profileID
        );
        if (item.fromUser.id === currentuser.userID && notME.length > 0) {
          item.profilePic = notME[0].profilePic;
        }
      } else {
        title = item.fromProfile.profileName;
      }
    }

    return (
      <div className="item unread" key={item.id}>
        <span
          onClick={() => readChat(item.chatID, item.unSeenCount)}
          className="inbox-item"
        >
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
    const { messages, handleEnd } = this.props;

    return (
      <div className="conversations">
        {this.renderMsgList({ messages })}
        <div className="item">
          <Waypoint
            onEnter={({ previousPosition }) => handleEnd(previousPosition)}
          />
        </div>
      </div>
    );
  }
}

export default InboxList;
