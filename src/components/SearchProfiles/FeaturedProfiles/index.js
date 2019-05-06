import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";
import FeaturedCard from "./FeaturedCard";
import arraysEqual from "../../../utils/arraysEqual";

const configLightGallery = {
  selector: "a",
  width: "100%"
};

class FeaturedDiv extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.featuredProfiles !== nextProps.featuredProfiles ||
      !arraysEqual(this.props.likedProfiles, nextProps.likedProfiles) ||
      this.props.msgdProfiles !== nextProps.msgdProfiles
    ) {
      return true;
    }
    return false;
  }

  onLightGallery = node => {
    this.lightGallery = node;
    $(node).lightGallery(configLightGallery);
  };

  componentWillUnmount() {
    try {
      $(this.lightGallery).lightGallery("destroy");
    } catch (e) {}
  }

  render() {
    const {
      featuredProfiles,
      showMsgModal,
      likeProfile,
      t,
      history,
      dayjs,
      likedProfiles,
      msgdProfiles
    } = this.props;

    return (
      <section className="featured-profiles">
        <div className="container">
          <div className="col-md-12">
            <div className="row" ref={this.onLightGallery}>
              <span className="head">{t("featmems")}</span>
              <OwlCarousel
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
                  {
                    const liked = likedProfiles.includes(profile.id);
                    return (
                      <FeaturedCard
                        key={Math.random()}
                        profile={profile}
                        showMsgModal={showMsgModal}
                        likeProfile={likeProfile}
                        t={t}
                        dayjs={dayjs}
                        history={history}
                        liked={liked}
                        msgd={msgdProfiles.includes(profile.id)}
                      />
                    );
                  }
                })}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default FeaturedDiv;
