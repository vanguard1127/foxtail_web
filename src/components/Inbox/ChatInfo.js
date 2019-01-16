import React from "react";
const ChatInfo = ({ profileID, chatID, t }) => {
  return (
    <div className="col-xl-2">
      <div className="right">
        <div className="head" />
        <div className="content">
          <div className="visit-profile">
            <span>{t("visit")}</span>
          </div>
          <div className="functions">
            <ul>
              <li className="search">
                <span>{t("searchconv")}</span>
              </li>
              <li className="delete">
                <span>{t("deleconv")}</span>
              </li>
              <li className="report">
                <span>{t("reportconv")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
