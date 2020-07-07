import React, { memo } from "react";

import { ProfileActionBtns, ProfilePic, ProfileInfoDiv } from "../ProfileCard";
import { WithT } from "i18next";

interface IFeaturedCardProps extends WithT {
  profile: any;
  showMsgModal: (profile: any) => void;
  likeProfile: (profile: any) => void;
  dayjs: any;
  liked: boolean;
  msgd: boolean;
  distanceMetric: string;
  toggleBlockModalVisible: (profile: any) => void;
  history: any;
}

const FeaturedCard: React.FC<IFeaturedCardProps> = memo(({
  profile,
  showMsgModal,
  likeProfile,
  t,
  dayjs,
  liked,
  msgd,
  distanceMetric,
  toggleBlockModalVisible,
  history
}) => {

  const goTo = () => {
    history.push("/member/" + profile.id);
  };

  let badge = "";
  if (profile.users.every(
    user => user.verifications.photoVer.active && user.verifications.stdVer.active
  )) {
    badge = "verified both";
  } else if (profile.users.every(user => user.verifications.stdVer.active)) {
    badge = "verified std";
  } else if (
    profile.users.every(user => user.verifications.photoVer.active)
  ) {
    badge = "verified photo";
  }

  return (
    <div className={`item ${badge}`}>
      <div className="info">
        <span onClick={goTo}>
          <ProfileInfoDiv
            profile={profile}
            t={t}
            dayjs={dayjs}
            distanceMetric={distanceMetric}
          />
          <ProfilePic profilePic={profile.profilePic} />
        </span>
        <div
          className="removeProfile"
          onClick={() => toggleBlockModalVisible(profile)}
        ></div>
      </div>
      <ProfileActionBtns
        likeProfile={likeProfile}
        showMsgModal={showMsgModal}
        profile={profile}
        liked={liked}
        msgd={msgd}
        t={t}
        featured={true}
      />
    </div>
  );
})

export default FeaturedCard;
