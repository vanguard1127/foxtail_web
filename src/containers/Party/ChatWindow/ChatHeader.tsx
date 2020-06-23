import React, { memo, useState } from "react";
import { NavLink } from "react-router-dom";
import { WithT } from "i18next";
import NoProfileImg from "assets/img/elements/no-profile.png";

import ChatActions from "./ChatActions";

interface IChatHeader extends WithT {
  currentChat: any;
  chatID: string;
  setBlockModalVisible?: () => void;
  isOwner?: boolean;
  leaveDialog?: () => void;
}

const ChatHeader: React.FC<IChatHeader> = memo(
  ({ currentChat, chatID, setBlockModalVisible, isOwner, leaveDialog, t }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    let chatProfilePic = "";
    let chatProfileID = "";

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
            <span className="name" title={currentChat.name}>
              <span>{currentChat.name}</span>
            </span>
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
  }
);

export default ChatHeader;
