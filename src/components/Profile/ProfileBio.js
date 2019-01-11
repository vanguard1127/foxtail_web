import React from "react";
const ProfileBio = ({ about }) => {
  return (
    <div className="user-bio">
      <div className="profile-head">User Bio</div>
      <p>
        {about
          ? about
          : "This user hasn't filled in their bio yet. Send them a message to chat."}
      </p>
    </div>
  );
};

export default ProfileBio;
