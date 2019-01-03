import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";
const ChatWindow = ({ currentChat, currentuser }) => {
  if (currentChat !== null) {
    sessionStorage.setItem("pid", currentChat.id);
  } else {
    sessionStorage.setItem("pid", null);
  }
  return (
    <div className="col-md-8 col-lg-9 col-xl-7">
      {currentChat !== null ? (
        <div className="chat">
          <ChatHeader currentChat={currentChat} currentuser={currentuser} />
          <ChatContent
            chatID={currentChat.id}
            currentUserID={currentuser.userID}
          />
          <ChatPanel chatID={currentChat.id} />
        </div>
      ) : (
        <div>empty</div>
      )}
    </div>
  );
};

export default ChatWindow;
