import React from "react";

const ProfilePic = ({ profilePic }) => {
  return (
    <div className="image">
      <img
        src={
          profilePic !== ""
            ? profilePic
            : "assets/img/usr/medium-avatar/1001@2x.png"
        }
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
