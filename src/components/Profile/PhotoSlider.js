import React from "react";
import OwlCarousel from "react-owl-carousel";
const PhotoSlider = ({ photos, isPublic, t }) => {
  return (
    <div
      className={isPublic ? "photos-slider public" : "photos-slider private"}
    >
      <div className="profile-head">
        {isPublic ? t("Public") : t("Private")} {t("Photos")} (21)
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
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/img/usr/medium-avatar/1001@2x.png"
                }
                alt=""
              />
            </div>
          );
        })}
      </OwlCarousel>
    </div>
  );
};

export default PhotoSlider;