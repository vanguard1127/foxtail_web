import React from "react";
import ProfilePic from "./ProfilePic";
import DesiresBlock from "./DesiresBlock";
import ProfileActionBtns from "./ProfileActionBtns";
import ProfileInfoBox from "./ProfileInfoBox";

const ProfileCard = ({
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
    <div className="col-md-6 col-lg-4">
      <div className={"card-item " + badge}>
        <a href={null} onClick={() => history.push("/members/" + profile.id)}>
          <ProfilePic profilePic={profile.profilePic} />
        </a>
        <div className="info">
          <a href={null} onClick={() => history.push("/members/" + profile.id)}>
            <ProfileInfoBox
              users={profile.users}
              lastOnline={profile.showOnline && profile.updatedAt}
              distance={profile.distance}
            />
          </a>
          <DesiresBlock desires={profile.desires} />
          <ProfileActionBtns
            profile={profile}
            likeProfile={likeProfile}
            showMsgModal={showMsgModal}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
