import React from "react";
const ChatInfo = ({ profileID, chatID, t }) => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="visit-profile">
            <span>{t("Visit Profile")}</span>
          </div>
          <div className="functions">
            <ul>
              <li className="search">
                <span>{t("Search for Conversation")}</span>
              </li>
              <li className="delete">
                <span>{t("Delete the Conversation")}</span>
              </li>
              <li className="report">
                <span>{t("Report the Conversation")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
