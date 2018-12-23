import React from "react";
import ProfilePic from "./ProfilePic";
import DesiresBlock from "./DesiresBlock";
import ProfileActionBtns from "./ProfileActionBtns";
import ProfileInfoBox from "./ProfileInfoBox";

const ProfileCard = ({
  profile,
  setProfile,
  showMsgModal,
  showBlockModal,
  showShareModal,
  likeProfile
}) => {
  const stdCheck = profile.users.every(user => user.verifications.std === true);
  const photoCheck = profile.users.every(
    user => user.verifications.photo === true
  );
  let badge = "";
  if (photoCheck) {
    badge = "verified";
  }
  return (
    <div className="col-md-6 col-lg-4">
      <div className={"card-item " + badge}>
        <ProfilePic profilePic={profile.profilePic} />
        <div className="info">
          <ProfileInfoBox
            users={profile.users}
            lastOnline={profile.showOnline && profile.updatedAt}
          />
          <DesiresBlock desires={profile.desires} />
          <ProfileActionBtns
            setProfile={setProfile}
            likeProfile={likeProfile}
            showMsgModal={showMsgModal}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
