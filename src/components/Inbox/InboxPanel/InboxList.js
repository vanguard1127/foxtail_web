import React, { PureComponent } from "react";
import { Waypoint } from "react-waypoint";
import TimeAgo from "../../../utils/TimeAgo";

const NoProfileImg = require("../../../assets/img/elements/no-profile.png");

class InboxList extends PureComponent {
  unsubscribe;
  state = { chatID: null };
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleEnd = previousPosition => {
    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.props.fetchData();
      }
    }
  };

  renderItem = (item, timeAgo) => {
    const { currentuser, readChat, t } = this.props;
    let title;
    if (item.type === "alert" || item.type === "left") {
      title = "Foxtail";
      item.profilePic = NoProfileImg;
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

      //kinda hacky but need to use "New Match!" for inbox subscription
      item.text =
        item.text === "" || item.text === "New Match!"
          ? t("newmatch")
          : item.text;
    }

    return (
      <div className="item unread" key={item.chatID}>
        <span
          onClick={() => readChat(item.chatID, item.unSeenCount)}
          className="inbox-item"
        >
          <span className="img">
            <img
              src={item.profilePic !== "" ? item.profilePic : NoProfileImg}
              alt=""
              
            />
          </span>
          <div className="data">
            <span className="name" title={title}>
              {title}
            </span>
            <span className={item.blackMember ? "time blk" : "time"}>
              {timeAgo}
            </span>
            <span className={item.type !== "new" ? "msg" : "msg new"}>
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
      <>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.createdAt);

          return this.renderItem(message, timeAgo);
        })}
      </>
    );
  };

  //Variables by text
  render() {
    let { searchTerm, messages } = this.props;
    if (searchTerm !== "") {
      messages = messages.filter(msg =>
        msg.participants[0].profileName
          .toLocaleLowerCase()
          .startsWith(searchTerm.toLocaleLowerCase())
      );
    }

    return (
      <div className="conversations">
        {this.renderMsgList({ messages })}
        <div className="item">
          <Waypoint
            onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
          />
        </div>
      </div>
    );
  }
}

export default InboxList;
