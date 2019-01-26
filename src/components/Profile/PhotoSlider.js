import React from "react";
import OwlCarousel from "react-owl-carousel";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
const PhotoSlider = ({ photos, isPublic, t }) => {
  return (
    <div
      className={isPublic ? "photos-slider public" : "photos-slider private"}
    >
      <div className="profile-head">
        {isPublic ? t("Public") : t("Private")} {t("Photos")} ({photos.length})
      </div>
      <OwlCarousel
        className="owl-carousel slider-content"
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
        {photos.map(photo => {
          return (
            <div className="item" key={photo.id}>
              <img src={photo.url} alt="" onContextMenu={preventContextMenu} />
            </div>
          );
        })}
      </OwlCarousel>
    </div>
  );
};

export default PhotoSlider;
