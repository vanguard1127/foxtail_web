import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const NoProfileImg = require("../../../../src/assets/img/elements/no-profile.png");
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
        src={proPic}
        onLoad={() => {
          setLoading(false);
        }}
        onError={() => {
          console.log("test", proPic);
          setLoading(false);
          setPropic(NoProfileImg);
        }}
      />
    </div>
  );
};

export default ProfilePic;
