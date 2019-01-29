import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";
import "lg-thumbnail";
import "lg-fullscreen";
import "lg-zoom";
import "lg-autoplay";

const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};

const configLightGallery = {
  thumbnail: true,
  selector: ".item",
  width: "100%",
  download: false,
  mousewheel: true,
  zoom: true
};

class PhotoSlider extends Component {
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
    const { isPublic, photos, t } = this.props;

    return (
      <div
        className={isPublic ? "photos-slider public" : "photos-slider private"}
      >
        <div className="profile-head">
          {isPublic ? t("Public") : t("Private")} {t("Photos")} ({photos.length}
          )
        </div>
        <div id="lightgallery" ref={this.onLightGallery}>
          <OwlCarousel
            className="owl-carousel slider-content"
            autoplay
            margin={30}
            nav
            dots={false}
            navText={[
              '<i class="icon-left-open">',
              '<i class="icon-right-open">'
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
                items: 6
              }
            }}
          >
            {photos.map(photo => (
              <a href={photo.url} className="item" key={Math.random()}>
                <img
                  src={photo.url}
                  alt=""
                  onContextMenu={preventContextMenu}
                />
              </a>
            ))}
          </OwlCarousel>
        </div>
      </div>
    );
  }
}

export default PhotoSlider;
