import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import FeaturedCard from "./FeaturedCard";

class FeaturedDiv extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.featuredProfiles !== nextProps.featuredProfiles) {
      return true;
    }
    return false;
  }
  render() {
    const {
      featuredProfiles,
      showMsgModal,
      likeProfile,
      t,
      history,
      dayjs
    } = this.props;

    return (
      <section className="featured-profiles" key="na">
        <div className="container">
          <div className="col-md-12">
            <span className="head">{t("featmems")}</span>
            <OwlCarousel
              className="owl-carousel slider"
              autoplay
              nav
              margin={30}
              loop={true}
              dots={false}
              navText={[
                '<i className="icon-left-open">',
                '<i className="icon-right-open">'
              ]}
              lazyLoad
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
                  />
                );
              })}
            </OwlCarousel>
          </div>
        </div>
      </section>
    );
  }
}

export default FeaturedDiv;
