import React, { useState } from "react";

import NoProfileImg from "assets/img/elements/no-profile.png";

interface IProfilePic {
  profilePic: string;
  handlePreview: (imageSource: string) => void;
}

const ProfilePic: React.FC<IProfilePic> = ({ profilePic, handlePreview }) => {
  const [loading, setLoading] = useState(true);
  const [proPic, setPropic] = useState(profilePic);
  return (
    <div className="avatar" style={{ position: "relative" }}>
      {loading && (
        <div className="image-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="64px"
            height="64px"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      )}
      <img
        alt="profile pic"
        src={proPic}
        onClick={() => handlePreview(proPic)}
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
