import React from "react";
import OwlCarousel from "react-owl-carousel";
import { toast } from "react-toastify";
import { WithT } from "i18next";

import NoPictureImg from "assets/img/elements/no-picture.png";

interface IPhotoSliderProps extends WithT {
  isPublic: boolean,
  photos: any,
  ErrorHandler: any,
  handlePreview: (imageSource: string) => void;
}

const PhotoSlider: React.FC<IPhotoSliderProps> = ({
  isPublic,
  photos,
  ErrorHandler,
  handlePreview,
  t,
}) => {

  const warnPrivate = () => {
    if (!toast.isActive("privwarning")) {
      toast.info(t("privwarning"), {
        position: toast.POSITION.TOP_CENTER,
        toastId: "privwarning"
      });
    }
  }

  return (
    <ErrorHandler.ErrorBoundary>
      <div className={isPublic ? "photos-slider public" : "photos-slider private"}>
        <div className="profile-head">
          {isPublic ? t("Public") : t("Private")} {t("Photos")} (
            {photos.length})
          </div>
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
            <div className="item" key={Math.random()}>
              {photo.url !== "private" ? (
                <div onClick={() => handlePreview(photo.url)} >
                  <img src={photo.smallUrl} alt="" />
                </div>
              ) : (
                  <div onClick={warnPrivate}>
                    <img className="blur" src={NoPictureImg} alt="" />
                  </div>
                )}
            </div>
          ))}
        </OwlCarousel>
      </div>
    </ErrorHandler.ErrorBoundary>
  );
}

export default PhotoSlider;
