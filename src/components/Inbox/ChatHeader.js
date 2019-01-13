import React from "react";
import TimeAgo from "../../utils/TimeAgo";
import MembersDropdown from "../common/MembersDropdown";
const ChatHeader = ({ currentChat, currentuser }) => {
  let chatTitle = "Chat No Longer Available";
  let chatLastSeen = "";
  let chatTitleExtra = "";

  if (currentChat) {
    let notME = currentChat.participants.filter(
      el => el.id.toString() !== currentuser.profileID
    );
    if (notME.length > 0) {
      chatTitle = notME[0].profileName;
    } else {
      chatTitle = currentuser.username;
    }
    if (currentChat.participants.length > 2) {
      chatTitleExtra = ` + ${currentChat.participants.length - 2} participants`;
    }
    chatLastSeen = currentChat.participants[0].online
      ? "Online"
      : TimeAgo(currentChat.participants[0].updatedAt);
  }
  return (
    <div className="navbar">
      <div className="user">
        <div className="avatar">
          <span>
            <img src="assets/img/usr/avatar/1001@2x.png" alt="" />
          </span>
        </div>
        <span className="name couple">
          <span>
            {chatTitle}
            {chatTitleExtra}
          </span>
        </span>
        <span className="last-seen online">{chatLastSeen}</span>
      </div>
      <div className="more" />
      <div className="more-dropdown">
        <ul>
          <li>
            <span>Search for Conversation</span>
          </li>
          <li>
            <span>Delete the Conversation</span>
          </li>
          <li>
            <span>Report the Conversation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
