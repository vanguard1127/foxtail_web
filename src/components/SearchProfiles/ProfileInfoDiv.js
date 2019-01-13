import React from "react";
import ProfileInfoBox from "./ProfileInfoBox";
import DesiresBlock from "./DesiresBlock";

const ProfileInfoDiv = ({ profile, t }) => {
  return (
    <div className="data">
      <ProfileInfoBox
        users={profile.users}
        online={profile.showOnline && profile.online}
        t={t}
      />
      <DesiresBlock desires={profile.desires} t={t} />
    </div>
  );
};

export default ProfileInfoDiv;
