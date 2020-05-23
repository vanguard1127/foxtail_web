import React, { memo, useState } from "react";
import { NavLink } from "react-router-dom";
import { WithT } from "i18next";

import TimeAgo from "utils/TimeAgo";
import { IUser } from "types/user";
import NoProfileImg from "assets/img/elements/no-profile.png";

import ChatActions from "./ChatActions";

interface IChatHeader extends WithT {
  currentChat: any;
  currentuser: IUser;
  chatID: string;
  setBlockModalVisible?: () => void;
  isOwner?: boolean;
  leaveDialog?: () => void;
}

const ChatHeader: React.FC<IChatHeader> = memo(({
  currentChat,
  currentuser,
  chatID,
  setBlockModalVisible,
  isOwner,
  leaveDialog,
  t,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  let chatTitle = t("nothere");
  let chatLastSeen = "";
  let chatTitleExtra = "";
  let chatProfilePic = "";
  let chatProfileID = "";

  if (currentChat) {
    let notME = currentChat.participants.filter(
      el => el.id.toString() !== currentuser.profileID
    );

    if (notME.length > 0) {
      chatTitle = notME[0].profileName;
      chatProfilePic = notME[0].profilePic;
      chatProfileID = notME[0].id;
      if (notME[0].showOnline) {
        chatLastSeen = notME[0].online
          ? t("common:Online")
          : TimeAgo(notME[0].updatedAt);
      } else {
        chatLastSeen = "N/A";
      }
    } else {
      chatTitle = currentuser.username;
      chatProfilePic = currentChat.participants[0].profilePic;
      if (currentChat.participants[0].showOnline) {
        chatLastSeen = currentChat.participants[0].online
          ? t("common:Online")
          : TimeAgo(currentChat.participants[0].updatedAt);
      } else {
        chatLastSeen = "N/A";
      }
    }

    if (currentChat.participants.length > 2) {
      chatTitleExtra = ` +${currentChat.participants.length - 2}`;
    }
  }

  return (
    <div className="navbar">
      <div className="user">
        <NavLink to={"/member/" + chatProfileID}>
          <div className="avatar">
            <span>
              <img
                src={chatProfilePic ? chatProfilePic : NoProfileImg}
                alt=""
              />
            </span>
          </div>
          <span className="name" title={chatTitle}>
            <span>
              {chatTitle}
                &nbsp; {chatTitleExtra}
            </span>
          </span>
          {chatLastSeen !== "N/A" && (
            <span className="last-seen online">{chatLastSeen}</span>
          )}
        </NavLink>
      </div>
      <div className="more" onClick={toggleMenu} />
      <div className={isOpen ? "more-dropdown open" : "more-dropdown"}>
        <ChatActions
          chatID={chatID}
          t={t}
          setBlockModalVisible={setBlockModalVisible}
          isOwner={isOwner}
          leaveDialog={leaveDialog}
          participantsNum={currentChat.participants.length}
        />
      </div>
    </div>
  );
});

export default ChatHeader;
