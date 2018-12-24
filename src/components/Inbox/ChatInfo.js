import React from "react";
const ChatInfo = () => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="visit-profile">
            <a href="#">Visit Profile</a>
          </div>
          <div className="functions">
            <ul>
              <li className="search">
                <a href="#">Search for Conversation</a>
              </li>
              <li className="delete">
                <a href="#">Delete the Conversation</a>
              </li>
              <li className="report">
                <a href="#">Report the Conversation</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
