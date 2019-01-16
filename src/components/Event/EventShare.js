import React from "react";
import MembersDropdown from "../common/MembersDropdown";
const EventShare = ({ id, t }) => {
  return (
    <div className="share-event">
      <span className="title">{t("share")}:</span>
      <ul>
        <li className="facebook">
          <span />
        </li>
        <li className="twitter">
          <span />
        </li>
        <li className="mail">
          <MembersDropdown
            targetID={id}
            targetType={"event"}
            listType={"friends"}
            clickComponent={<span />}
            t={t}
          />
        </li>
      </ul>
    </div>
  );
};

export default EventShare;
