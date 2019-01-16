import React from "react";
import MembersDropdown from "../common/MembersDropdown";
const GoingBar = ({ id, participants, t }) => {
  return (
    <div className="goings">
      <span className="stats">
        <MembersDropdown
          targetID={id}
          targetType={"event"}
          listType={"participants"}
          t={t}
          clickComponent={
            <div className="content">
              <ul>
                <li>
                  <img src="/assets/img/usr/avatar/1001@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1002@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
                </li>
                <li>
                  <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
                </li>
              </ul>
              <span className="stats">
                <b>
                  {participants.length} {t("common:people")}
                </b>{" "}
                {t("common:going")}
              </span>
            </div>
          }
        />
      </span>
    </div>
  );
};

export default GoingBar;
