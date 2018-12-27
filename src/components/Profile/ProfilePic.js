import React from "react";
const ProfilePic = ({ profilePic }) => {
  return (
    <div className="avatar">
      <img
        src={
          profilePic !== ""
            ? profilePic
            : process.env.PUBLIC_URL + "/assets/img/usr/big-avatar/1003@2x.png"
        }
        alt=""
      />
    </div>
  );
};

export default ProfilePic;
