import React from "react";
import ProfileInfoDiv from "./ProfileInfoDiv";
import ProfilePic from "./ProfilePic";
import ProfileActionBtns from "./ProfileActionBtns";

const FeaturedCard = ({
  profile,
  showMsgModal,
  showBlockModal,
  showShareModal,
  likeProfile,
  history
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
        <a href={null} onClick={() => history.push("/members/" + profile.id)}>
          <ProfileInfoDiv profile={profile} />
          <ProfilePic profilePic={profile.profilePic} />
        </a>
      </div>
      <ProfileActionBtns
        likeProfile={likeProfile}
        showMsgModal={showMsgModal}
      />
    </div>
  );
};

export default FeaturedCard;
