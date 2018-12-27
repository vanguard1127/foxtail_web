import React from "react";
import { Button, Badge } from "antd";
import ImageCarousel from "./ImageCarousel";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
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
