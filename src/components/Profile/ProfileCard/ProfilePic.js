import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import NoProfileImg from "../../../assets/img/elements/no-profile.png";

const ProfilePic = ({ profilePic, handlePreview }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(profilePic);

  return (
    <div className="avatar">
      {loading && (
        <div style={{ position: "absolute" }}>
          <CircularProgress />
        </div>
      )}
      <img
        alt="profile pic"
        src={proPic}
        onClick={handlePreview}
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
