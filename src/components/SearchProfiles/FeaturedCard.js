import React from "react";
import ProfileInfoDiv from "./ProfileInfoDiv";
import ProfilePic from "./ProfilePic";
import ProfileActionBtns from "./ProfileActionBtns";

const FeaturedCard = ({
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
    <div className={"item " + badge}>
      <div className="info">
        <a href="#">
          <ProfileInfoDiv profile={profile} />
          <ProfilePic profilePic={profile.profilePic} />
        </a>
      </div>
      <ProfileActionBtns
        setProfile={setProfile}
        likeProfile={likeProfile}
        showMsgModal={showMsgModal}
      />
    </div>
  );
};

export default FeaturedCard;
