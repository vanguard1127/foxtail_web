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
    chatLastSeen = TimeAgo(currentChat.participants[0].updatedAt);
  }
  return (
    <div className="navbar">
      <div className="user">
        <div className="avatar">
          <a href="#">
            <img src="assets/img/usr/avatar/1001@2x.png" alt />
          </a>
        </div>
        <span className="name couple">
          <a href="#">
            {chatTitle}
            {chatTitleExtra}
          </a>
        </span>
        <span className="last-seen online">{chatLastSeen}</span>
      </div>
      <div className="more" />
      <div className="more-dropdown">
        <ul>
          <li>
            <a href="#">Search for Conversation</a>
          </li>
          <li>
            <a href="#">Delete the Conversation</a>
          </li>
          <li>
            <a href="#">Report the Conversation</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
