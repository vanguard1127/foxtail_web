import React, { useState } from "react";

import NoProfileImg from "assets/img/elements/no-profile.png";

const EventCreator: React.FC<{ ownerProfile: any }> = ({ ownerProfile }) => {
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

export default EventCreator;
