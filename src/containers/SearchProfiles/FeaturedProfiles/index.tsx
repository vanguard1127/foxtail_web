import React from "react";
import OwlCarousel from "react-owl-carousel";

import FeaturedCard from "./FeaturedCard";

import "../searchProfiles.css";
import { WithT } from "i18next";

interface IFeaturedProfilesProps extends WithT {
  featuredProfiles: any;
  showMsgModal: (profile: any) => void;
  likeProfile: (profile: any) => void;
  history: any;
  dayjs: any;
  likedProfiles: any;
  msgdProfiles: any;
  distanceMetric: string;
  toggleBlockModalVisible: (profile: any) => void;
}
const FeaturedProfiles: React.FC<IFeaturedProfilesProps> = ({
  featuredProfiles,
  showMsgModal,
  likeProfile,
  t,
  history,
  dayjs,
  likedProfiles,
  msgdProfiles,
  distanceMetric,
  toggleBlockModalVisible
}) => {

  return (
    <section className="featured-profiles">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <span className="head">{t("featmems")}</span>
            <OwlCarousel
              key={`carousel_${featuredProfiles.length +
                likedProfiles.length +
                msgdProfiles.length}`}
              className="slider"
              autoplay
              nav
              lazyLoad
              margin={30}
              dots={false}
              navText={[
                '<i class="icon-left-open">',
                '<i class="icon-right-open">'
              ]}
              autoplayTimeout={5000}
              autoplayHoverPause={false}
              responsive={{
                0: {
                  items: 2,
                  margin: 15
                },
                768: {
                  items: 3,
                  margin: 15
                },
                992: {
                  items: 4,
                  margin: 15
                },
                1200: {
                  items: 4
                }
              }}
            >
              {featuredProfiles.map(profile => {
                return (
                  <FeaturedCard
                    key={profile.id}
                    profile={profile}
                    showMsgModal={showMsgModal}
                    likeProfile={likeProfile}
                    t={t}
                    dayjs={dayjs}
                    history={history}
                    liked={likedProfiles.includes(profile.id)}
                    msgd={msgdProfiles.includes(profile.id)}
                    distanceMetric={distanceMetric}
                    toggleBlockModalVisible={toggleBlockModalVisible}
                  />
                );
              })}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProfiles;
