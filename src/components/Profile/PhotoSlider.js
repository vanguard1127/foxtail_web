import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import { preventContextMenu } from "../../utils/image";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";

class PhotoSlider extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.t !== nextProps.t ||
      this.state.previewVisible !== nextState.previewVisible
    ) {
      return true;
    }
    return false;
  }

  state = { previewVisible: false, selectedImg: null };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillMount() {
    document.addEventListener("contextmenu", this.handleContextMenu);
  }

  handleContextMenu = event => {
    event.preventDefault();
    //const { target } = event;
    // const { classList, offsetParent } = target;
    // if (
    //   classList.contains("lg-image") ||
    //   (offsetParent && offsetParent.classList.contains("lg-thumb"))
    // ) {
    preventContextMenu(event);
    //  }
  };

  warnPrivate() {
    if (!toast.isActive("privwarning")) {
      toast.info(this.props.t("privwarning"), {
        position: toast.POSITION.TOP_CENTER,
        toastId: "privwarning"
      });
    }
  }

  handleClickOpen = img => {
    console.log("DSsds");
    if (this.mounted) {
      console.log("FO");
      this.setState({
        selectedImg: img,
        previewVisible: true
      });
    }
  };
  handleClose = () => {
    if (this.mounted) {
      this.setState({ previewVisible: false });
    }
  };
  render() {
    const { isPublic, photos, t, ErrorHandler } = this.props;
    const { previewVisible, selectedImg } = this.state;
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
                  <div onClick={() => this.handleClickOpen(photo.url)}>
                    <img src={photo.url} alt="" />
                  </div>
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
          {previewVisible && (
            <Lightbox mainSrc={selectedImg} onCloseRequest={this.handleClose} />
          )}
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default PhotoSlider;
