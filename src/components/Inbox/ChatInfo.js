import React from "react";
const ChatInfo = ({ profileID, chatID }) => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="visit-profile">
            <span>Visit Profile</span>
          </div>
          <div className="functions">
            <ul>
              <li className="search">
                <span>Search for Conversation</span>
              </li>
              <li className="delete">
                <span>Delete the Conversation</span>
              </li>
              <li className="report">
                <span>Report the Conversation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
