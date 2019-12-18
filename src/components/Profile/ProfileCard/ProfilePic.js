import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoProfileImg from "../../../assets/img/elements/no-profile.png";

const ProfilePic = ({ profilePic }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(profilePic);

  profilePic = NoProfileImg;
  return (
    <div className="avatar">
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
          setLoading(false);
          setPropic(NoProfileImg);
        }}
      />
    </div>
  );
};

export default ProfilePic;
