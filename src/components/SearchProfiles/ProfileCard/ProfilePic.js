import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as Sentry from "@sentry/browser";
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
        onError={err => {
          Sentry.captureException({ error: err, proPic });
          console.log("test", err, proPic);
          setPropic(NoProfileImg);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default ProfilePic;
