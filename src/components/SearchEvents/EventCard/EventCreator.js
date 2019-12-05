import React, { useState } from "react";
import { withRouter } from "react-router-dom";
const NoProfileImg = require("../../../assets/img/elements/no-profile.png");

const EventCreator = ({ ownerProfile }) => {
  const [proPic, setPropic] = useState(ownerProfile.profilePic);
  return (
    <div className="created">
      <span>
        <span className="avatar">
          <img
            src={proPic}
            alt=""
            onError={() => {
              setPropic(NoProfileImg);
            }}
          />
        </span>
        <span className="name" title={ownerProfile.profileName}>
          {ownerProfile.profileName}
        </span>
      </span>
    </div>
  );
};

export default withRouter(EventCreator);
