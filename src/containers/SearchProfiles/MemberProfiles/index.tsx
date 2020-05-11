import React, { memo } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";

import ProfileCard from "./ProfileCard";

import "../searchProfiles.css";

interface IMemberProfilesProps extends WithT {
  profiles: any;
  showMsgModal: (profile: any) => void;
  likeProfile: (profile: any) => void;
  history: any;
  handleEnd: any;
  dayjs: any;
  distanceMetric: string;
  likedProfiles: any;
  msgdProfiles: any;
  toggleBlockModalVisible: (profile: any) => void;
}

const MemberProfiles: React.FC<IMemberProfilesProps> = memo(({
  profiles,
  showMsgModal,
  likeProfile,
  history,
  handleEnd,
  t,
  dayjs,
  distanceMetric,
  likedProfiles,
  msgdProfiles,
  toggleBlockModalVisible
}) => {

  return (
    <section className="members">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <span className="head">{t("allmems")}</span>
            </div>
            {profiles.map(profile => {
              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  showMsgModal={showMsgModal}
                  likeProfile={likeProfile}
                  t={t}
                  history={history}
                  dayjs={dayjs}
                  distanceMetric={distanceMetric}
                  liked={likedProfiles.includes(profile.id)}
                  msgd={msgdProfiles.includes(profile.id)}
                  toggleBlockModalVisible={toggleBlockModalVisible}
                />
              );
            })}
            <Waypoint
              onEnter={({ previousPosition }) => handleEnd({ previousPosition })}
              topOffset="50px"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

export default MemberProfiles;
