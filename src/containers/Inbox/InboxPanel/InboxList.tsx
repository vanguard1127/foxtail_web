import React, { memo, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";

import TimeAgo from "utils/TimeAgo";
import NoProfileImg from "assets/img/elements/no-profile.png";
import { IUser } from "types/user";

interface IInboxListProps extends WithT {
  messages: any,
  fetchData: () => void,
  openChat: (chatID: any) => void,
  currentuser: IUser,
  searchTerm: string,
  updateCount: (unSeenCount: any) => void,
  chatID: string | null,
}

const InboxList: React.FC<IInboxListProps> = memo(({
  messages,
  fetchData,
  openChat,
  currentuser,
  searchTerm,
  updateCount,
  chatID,
  t,
}) => {

  useEffect(() => {
    updateMsgCount();
  }, []);

  useEffect(() => {
    updateMsgCount();
  }, [chatID])

  const updateMsgCount = () => {
    if (updateCount && chatID) {
      const chatIndex = messages.findIndex(el => el.chatID === chatID);
      if (chatIndex > -1) {
        updateCount(messages[chatIndex].unSeenCount);
      }
    }
  };

  const handleEnd = previousPosition => {
    if (previousPosition === Waypoint.below) {
      fetchData();
    }
  };

  const renderItem = (item, timeAgo) => {
    let title, blackIcon;
    if (item.type === "alert" || item.type === "left") {
      title = "Foxtail";
      blackIcon = true;
      item.profilePic = NoProfileImg;
    } else {
      if (item.fromUser) {
        if (
          item.fromUser.id === currentuser.userID &&
          item.participants.length > 0
        ) {
          title = item.participants[0].profileName;
          //TODO: Fix to use Black from other person. must return black here
          blackIcon = false;
        } else {
          title = item.fromUser.username;
          blackIcon = item.blackMember;
        }
        let notME = item.participants.filter(
          el => el.id.toString() !== currentuser.profileID
        );
        if (item.fromUser.id === currentuser.userID && notME.length > 0) {
          item.profilePic = notME[0].profilePic;
        }
      } else {
        title = item.fromProfile.profileName;
        blackIcon = item.blackMember;
      }

      //kinda hacky but need to use "New Match!" for inbox subscription
      item.text =
        item.text === "" || item.text === "New Match!"
          ? t("newmatch")
          : item.text;
    }

    return (
      <div className="item unread" key={item.chatID}>
        <span onClick={() => openChat(item.chatID)} className="inbox-item">
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
            <span className={blackIcon ? "time blk" : "time"}>{timeAgo}</span>
            <span className={item.type !== "new" ? "msg" : "msg new"}>
              {item.type === "img" ? (
                <i>Image</i>
              ) : item.typingText ? (
                item.typingText
              ) : item.type === "left" ? (
                item.text + " " + t("leftchat")
              ) : (
                      item.text
                    )}
            </span>
            {item.unSeenCount !== 0 && (
              <span className="notif">{item.unSeenCount}</span>
            )}
          </div>
        </span>
      </div>
    );
  };

  const renderMsgList = ({ messages }) => {
    if (messages.length === 0) {
      return <span className="no-message">{t("nomsgsInbox")}</span>;
    }

    return (
      <>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.createdAt);
          const msgObj = { ...message };
          return renderItem(msgObj, timeAgo);
        })}
      </>
    );
  };

  let messagesCopy = [...messages];
  if (searchTerm !== "") {
    messagesCopy = messages.filter(msg =>
      msg.participants[0].profileName
        .toLocaleLowerCase()
        .startsWith(searchTerm.toLocaleLowerCase())
    );
  }

  return (
    <div className="conversations">
      {renderMsgList({ messages: messagesCopy })}
      <div className="item">
        <Waypoint
          onEnter={({ previousPosition }) => handleEnd(previousPosition)}
        />
      </div>
    </div>
  );
});

export default InboxList;
