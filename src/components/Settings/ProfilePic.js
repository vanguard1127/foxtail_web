import React from "react";
import Avatar from "react-avatar";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
const ProfilePic = ({ profilePic }) => {
  return (
    <div className="profile-picture-content">
      <div className="picture">
        <Avatar
          size="90"
          src={profilePic}
          round
          onContextMenu={preventContextMenu}
        />
      </div>
    </div>
  );
};

export default ProfilePic;
