import React from "react";
const ProfileBio = ({ about }) => {
  return (
    <div className="user-bio">
      <div className="profile-head">User Bio</div>
      <p>{about}</p>
    </div>
  );
};

export default ProfileBio;
