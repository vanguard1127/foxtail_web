import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import $ from "jquery";
import "lightgallery";
import "lg-thumbnail";
import "lg-fullscreen";
import "lg-zoom";
import "lg-autoplay";
import { preventContextMenu } from "../../utils/image";
import { toast } from "react-toastify";

const configLightGallery = {
  thumbnail: true,
  selector: "a",
  width: "100%",
  download: false,
  mousewheel: true,
  zoom: true
};

class PhotoSlider extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
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
      (offsetParent && offsetParent.classList.contains("lg-thumb"))
    ) {
      preventContextMenu(event);
    }
  };

  componentWillUnmount() {
    try {
      document.removeEventListener("contextmenu", this.handleContextMenu);
      $(this.lightGallery).lightGallery("destroy");
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e);
    }
  }

  warnPrivate() {
    if (!toast.isActive("privwarning")) {
      toast.info(this.props.t("privwarning"), {
        position: toast.POSITION.TOP_CENTER,
        toastId: "privwarning"
      });
    }
  }

  render() {
    const { isPublic, photos, t, ErrorHandler } = this.props;

    return (
      <ErrorHandler.ErrorBoundary>
        <div
          className={
            isPublic ? "photos-slider public" : "photos-slider private"
          }
        >
          <div className="profile-head">
            {isPublic ? t("Public") : t("Private")} {t("Photos")} (
            {photos.length})
          </div>
          <div id="lightgallery" ref={this.onLightGallery}>
            <OwlCarousel
              nav
              autoplay
              lazyLoad
              loop={false}
              margin={30}
              dots={false}
              navText={[
                '<i class="icon-left-open">',
                '<i class="icon-right-open">'
              ]}
              className="owl-carousel slider-content"
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
                  items: 6
                }
              }}
            >
              {photos.map(photo => (
                <div
                  className="item"
                  key={Math.random()}
                  onContextMenu={preventContextMenu}
                >
                  {photo.url !== "private" ? (
                    <a href={photo.url}>
                      <img src={photo.url} alt="" />
                    </a>
                  ) : (
                    <span onClick={this.warnPrivate.bind(this)}>
                      <img
                        className="blur"
                        src={"../assets/img/no-picture.png"}
                        alt=""
                      />
                    </span>
                  )}
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default PhotoSlider;
