import React from "react";
import Avatar from "react-avatar";

const ProfilePic = ({ profilePic }) => {
  return (
    <div className="profile-picture-content">
      <div className="picture">
        <Avatar size="90" src={profilePic} round />
      </div>
    </div>
  );
};

export default ProfilePic;
