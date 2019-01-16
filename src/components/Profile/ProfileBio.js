import React from "react";
const ProfileBio = ({ about, t }) => {
  return (
    <div className="user-bio">
      <div className="profile-head">{t("bio")}</div>
      <p>{about ? about : t("nobiomsg")}</p>
    </div>
  );
};

export default ProfileBio;
