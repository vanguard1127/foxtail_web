import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import FeaturedCard from "./FeaturedCard";

const FeaturedDiv = ({
  featuredProfiles,
  showMsgModal,
  showBlockModal,
  showShareModal,
  likeProfile
}) => {
  return (
    <section className="featured-profiles" key="nmn">
      <div className="container">
        <div className="col-md-12">
          <span className="head">Featured Profiles</span>
          <OwlCarousel
            className="owl-carousel slider"
            autoplay
            margin={30}
            nav
            dots={false}
            navText={[
              '<i className="icon-left-open">',
              '<i className="icon-right-open">'
            ]}
            lazyLoad
            autoplayTimeout={2400}
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
                  showBlockModal={showBlockModal}
                  showShareModal={showShareModal}
                  likeProfile={likeProfile}
                />
              );
            })}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiv;
