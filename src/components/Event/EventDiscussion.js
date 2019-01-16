import React from "react";
import ChatPanel from "./ChatPanel";
import ChatContent from "./ChatContent";
const EventDiscussion = ({ id, chatID, history, t }) => {
  return (
    <div className="discuss-content">
      <span className="head">{t("discuss")}</span>
      <ChatPanel chatID={chatID} t={t} />
      <ChatContent chatID={chatID} history={history} t={t} />
    </div>
  );
};

export default EventDiscussion;
