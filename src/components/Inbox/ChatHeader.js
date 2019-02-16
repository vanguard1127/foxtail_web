import React from 'react';
import TimeAgo from '../../utils/TimeAgo';
const ChatHeader = ({ currentChat, currentuser, t }) => {
  let chatTitle = t('nothere');
  let chatLastSeen = '';
  let chatTitleExtra = '';

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
      chatTitleExtra =
        ` + ${currentChat.participants.length - 2}` + t('participants');
    }
    chatLastSeen = currentChat.participants[0].online
      ? t('common:Online')
      : TimeAgo(currentChat.participants[0].updatedAt);
  }
  return (
    <div className="navbar">
      <div className="user">
        <div className="avatar">
          <span>
            <img src={currentChat.participants[0].profilePic} alt="" />
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
            <span>{t('leaveconv')}</span>
          </li>
          <li>
            <span>{t('reportconv')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatHeader;
