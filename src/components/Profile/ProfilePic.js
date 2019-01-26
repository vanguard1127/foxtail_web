import React from "react";

const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
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
        onContextMenu={preventContextMenu}
      />
    </div>
  );
};

export default ProfilePic;
