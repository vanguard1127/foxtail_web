import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

class ImageCarousel extends Component {
  render() {
    return (
      <Carousel showThumbs={false} showStatus={false}>
        <div>
          <img
            alt="photo1"
            src={require("../../images/girl1.jpg")}
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <div>
          <img
            alt="photo2"
            src={require("../../images/girl2.jpg")}
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <div>
          <img
            alt="photo3"
            src={require("../../images/girl3.jpg")}
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      </Carousel>
    );
  }
}

export default ImageCarousel;
