import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";
import "lg-thumbnail";
import "lg-fullscreen";
import "lg-zoom";
import "lg-autoplay";
import { preventContextMenu } from "../../utils/image";

const configLightGallery = {
  thumbnail: true,
  selector: "a",
  width: "100%",
  thumbnail: true,
  download: false,
  mousewheel: true,
  zoom: true
};

class PhotoSlider extends Component {
  shouldComponentUpdate() {
    return false;
  }
  onLightGallery = node => {
    this.lightGallery = node;
    $(node).lightGallery(configLightGallery);
  };

  componentWillMount() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu = event => {
    event.preventDefault();
    const { target } = event;
    const { classList, offsetParent } = target;
    if (
      classList.contains("lg-image") ||
      offsetParent.classList.contains("lg-thumb")
    ) {
      preventContextMenu(event);
    }
  };

  componentWillUnmount() {
    try {
      document.removeEventListener("contextmenu", this.handleContextMenu);
      $(this.lightGallery).lightGallery("destroy");
    } catch (e) {}
  }

  render() {
    const { isPublic, photos, t } = this.props;
    console.log(photos);
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
              <div
                className="item"
                key={photo.id}
                onContextMenu={preventContextMenu}
              >
                <a href={photo.url}>
                  <img src={photo.url} alt="" />
                </a>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    );
  }
}

export default PhotoSlider;
