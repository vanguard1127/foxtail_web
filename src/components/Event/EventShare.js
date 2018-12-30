import React from "react";
import MembersDropdown from "../common/MembersDropdown";
const EventShare = ({ id }) => {
  return (
    <div className="share-event">
      <span className="title">Share Event:</span>
      <ul>
        <li className="facebook">
          <a href="#" />
        </li>
        <li className="twitter">
          <a href="#" />
        </li>
        <li className="mail">
          <MembersDropdown
            targetID={id}
            targetType={"event"}
            listType={"friends"}
            clickComponent={<a href="#" />}
          />
        </li>
      </ul>
    </div>
  );
};

export default EventShare;
