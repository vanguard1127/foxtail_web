import React from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
const EventDiscussion = ({ id, chatID, history }) => {
  return (
    <div className="discuss-content">
      <span className="head">Discuss this event</span>
      <ChatPanel chatID={chatID} />
      <ChatContent chatID={chatID} history={history} />
    </div>
  );
};

export default EventDiscussion;
