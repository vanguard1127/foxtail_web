import React from "react";
import ProfileInfoBox from "./ProfileInfoBox";
import DesiresBlock from "./DesiresBlock";

const ProfileInfoDiv = ({ profile, history }) => {
  return (
    <div className="data">
      <ProfileInfoBox
        users={profile.users}
        lastOnline={profile.showOnline && profile.updatedAt}
      />
      <DesiresBlock desires={profile.desires} />
    </div>
  );
};

export default ProfileInfoDiv;
