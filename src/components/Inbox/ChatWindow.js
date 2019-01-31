import React from 'react';
import ChatHeader from './ChatHeader';
import AdManager from '../common/AdManager';
import ChatContent from './ChatContent';
import ChatPanel from './ChatPanel';
const ChatWindow = ({ currentChat, currentuser, t, ErrorHandler }) => {
  if (currentChat !== null) {
    sessionStorage.setItem('pid', currentChat.id);
  } else {
    sessionStorage.setItem('pid', null);
  }
  return (
    <div className="col-md-8 col-lg-9 col-xl-7">
      {currentChat !== null ? (
        <div className="chat">
          <ChatHeader
            currentChat={currentChat}
            currentuser={currentuser}
            t={t}
          />
          <ChatContent
            chatID={currentChat.id}
            currentUserID={currentuser.userID}
            t={t}
            ErrorHandler={ErrorHandler}
          />
          <ChatPanel
            chatID={currentChat.id}
            t={t}
            ErrorHandler={ErrorHandler}
          />
        </div>
      ) : (
        <AdManager />
      )}
    </div>
  );
};

export default ChatWindow;
