import React, { memo } from "react";
import { WithT } from "i18next";

import KinksBlock from "../KinksBlock";
import { ProfileActionBtns, ProfileInfoBox, ProfilePic } from "../ProfileCard";

interface IMemberProfileCard extends WithT {
  profile: any;
  showMsgModal: (profile: any) => void;
  likeProfile: (profile: any) => void;
  dayjs: any;
  distanceMetric: string;
  liked: boolean;
  msgd: boolean;
  toggleBlockModalVisible: (profile: any) => void;
  history: any;
}

const MemberProfileCard: React.FC<IMemberProfileCard> = memo(({
  profile,
  showMsgModal,
  likeProfile,
  t,
  dayjs,
  distanceMetric,
  liked,
  msgd,
  toggleBlockModalVisible,
  history
}) => {

  const onMemberClick = () => {
    history.push(`/member/${profile.id}`);
  };
  const stdCheck = profile.users.every(
    user => user.verifications.stdVer.active
  );
  const photoCheck = profile.users.every(
    user => user.verifications.photoVer.active
  );

  let badge = "";
  if (photoCheck && stdCheck) {
    badge = "verified both";
  } else if (photoCheck) {
    badge = "verified photo";
  } else if (stdCheck) {
    badge = "verified std";
  }

  return (
    <div className="col-md-6 col-lg-4">
      <div className={"card-item " + badge}>
        <span onClick={onMemberClick}>
          <ProfilePic profilePic={profile.profilePic} />
        </span>

        <div className="info">
          <span className="profile-info">
            <ProfileInfoBox
              profileName={profile.profileName}
              users={profile.users}
              online={profile.showOnline && profile.online}
              distance={profile.distance}
              t={t}
              dayjs={dayjs}
              distanceMetric={distanceMetric}
              toggleBlockModalVisible={() => toggleBlockModalVisible(profile)}
              onClick={onMemberClick}
            />
            <KinksBlock
              kinks={profile.kinks}
              t={t}
              id={profile.id}
              onClick={onMemberClick}
            />
          </span>
          <ProfileActionBtns
            profile={profile}
            likeProfile={likeProfile}
            showMsgModal={showMsgModal}
            liked={liked}
            msgd={msgd}
            t={t}
          />
        </div>
      </div>
    </div>
  );
});

export default MemberProfileCard;
