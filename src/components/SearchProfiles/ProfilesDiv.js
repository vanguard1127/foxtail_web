import React from "react";
import ProfileCard from "./ProfileCard";

const ProfilesDiv = ({
  profiles,
  setProfile,
  showMsgModal,
  showBlockModal,
  showShareModal,
  likeProfile,
  history
}) => {
  return (
    <section className="members">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <span className="head">All Members</span>
            </div>
            {profiles.map(profile => {
              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  setProfile={setProfile}
                  showMsgModal={showMsgModal}
                  showBlockModal={showBlockModal}
                  showShareModal={showShareModal}
                  likeProfile={likeProfile}
                  history={history}
                />
              );
            })}
            <div className="col-md-12">
              <div className="more-content-btn">
                <a href="#">More Profiles</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilesDiv;
