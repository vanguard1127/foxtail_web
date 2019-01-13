import React from "react";
const ProfileBio = ({ about, t }) => {
  return (
    <div className="user-bio">
      <div className="profile-head">{t("User Bio")}</div>
      <p>
        {about
          ? about
          : t(
              "This user hasn't filled in their bio yet. Send them a message to chat."
            )}
      </p>
    </div>
  );
};

export default ProfileBio;
