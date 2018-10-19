import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

class ImageCarousel extends Component {
  render() {
    //const { photos,showThumb } = this.props;

    const { showThumbs, autoPlay, selectedItem } = this.props;
    return (
      // <Carousel showThumbs={false} showStatus={false}>
      //   {photos.map(photo => (
      //     <div>
      //       <img
      //         alt={photo.order}
      //         src={photo.url}
      //         style={{ width: "100%", height: "35vh" }}
      //       />
      //     </div>
      //   ))}
      // </Carousel>

      <Carousel
        showThumbs={showThumbs}
        showStatus={false}
        width="100%"
        autoPlay={autoPlay}
        selectedItem={selectedItem}
      >
        <div>
          <img
            alt="photo1"
            src={require("../../images/girl1.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo2"
            src={require("../../images/girl2.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo3"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo4"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo1"
            src={require("../../images/girl1.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo2"
            src={require("../../images/girl2.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo3"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div>
          <img
            alt="photo4"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
      </Carousel>
    );
  }
}

export default ImageCarousel;
