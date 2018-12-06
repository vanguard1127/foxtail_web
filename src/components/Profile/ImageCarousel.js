import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { s3url } from "../../docs/data";

class ImageCarousel extends Component {
  render() {
    //const { photos,showThumb } = this.props;

    const { showThumbs, autoPlay, selectedItem, photos } = this.props;
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
        emulateTouch
        showThumbs={showThumbs}
        showStatus={false}
        width="100%"
        autoPlay={autoPlay}
        selectedItem={selectedItem}
      >
        {photos.map((photo, i) => (
          <div key={i + Math.random()}>
            <img
              alt={i}
              src={s3url + photo.url}
              style={{ width: "23vw", height: "35vh" }}
            />
          </div>
        ))}
      </Carousel>
    );
  }
}

export default ImageCarousel;
