import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import NoProfileImg from "assets/img/elements/no-profile.png";

const ProfilePic = ({ profilePic }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(profilePic);

  profilePic = NoProfileImg;
  return (
    <div className="image">
      {loading && (
        <div style={{ position: "absolute" }}>
          <CircularProgress />
        </div>
      )}
      <img
        alt=""
        src={proPic}
        onLoad={() => {
          setLoading(false);
        }}
        onError={err => {
          setPropic(NoProfileImg);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default ProfilePic;
