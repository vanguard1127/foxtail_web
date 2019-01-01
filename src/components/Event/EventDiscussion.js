import React from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
const EventDiscussion = ({ id, chatID }) => {
  return (
    <div className="discuss-content">
      <span className="head">Discuss this event</span>
      <ChatPanel chatID={chatID} />
      <ChatContent chatID={chatID} />
    </div>
  );
};

export default EventDiscussion;
