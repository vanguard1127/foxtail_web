import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
//TODO: Remove Sentry when tested pohoti issue
import * as Sentry from "@sentry/browser";
import NoProfileImg from "../../../../src/assets/img/elements/no-profile.png";
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
        alt="profilePic"
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
