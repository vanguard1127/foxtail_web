import React, { PureComponent, Fragment } from "react";
import { Waypoint } from "react-waypoint";
import TimeAgo from "../../../utils/TimeAgo";
import { preventContextMenu } from "../../../utils/image";

class InboxList extends PureComponent {
  state = { chatID: null };

  renderItem = (item, timeAgo) => {
    const { currentuser, readChat, t } = this.props;

    let title;
    if (item.type === "alert" || item.type === "left") {
      title = "Foxtail";
      item.profilePic = "../assets/img/no-profile.png";
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
      <div className="item unread" key={item.chatID}>
        <span
          onClick={() => readChat(item.chatID, item.unSeenCount)}
          className="inbox-item"
        >
          <span className="img">
            <img
              src={
                item.profilePic !== ""
                  ? item.profilePic
                  : "../assets/img/no-profile.png"
              }
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div className="data">
            <span className="name">{title}</span>
            <span className="time">{timeAgo}</span>
            <span className="msg">
              {item.type === "left"
                ? item.text + " " + t("leftchat")
                : item.text}
            </span>
            {item.unSeenCount !== 0 && (
              <span className="notif">{item.unSeenCount}</span>
            )}
          </div>
        </span>
      </div>
    );
  };

  renderMsgList = ({ messages }) => {
    if (messages.length === 0) {
      return <span className="no-message">{this.props.t("nomsgsInbox")}</span>;
    }
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
