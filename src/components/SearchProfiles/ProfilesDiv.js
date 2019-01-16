import React from "react";
import ProfileCard from "./ProfileCard";
import Waypoint from "react-waypoint";

const ProfilesDiv = ({
  profiles,
  showMsgModal,
  showBlockModal,
  showShareModal,
  likeProfile,
  history,
  handleEnd,
  t
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
                  showBlockModal={showBlockModal}
                  showShareModal={showShareModal}
                  likeProfile={likeProfile}
                  t={t}
                  history={history}
                />
              );
            })}
            <Waypoint
              onEnter={({ previousPosition, currentPosition }) =>
                handleEnd({
                  previousPosition,
                  currentPosition
                })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilesDiv;
