import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

class ImageCarousel extends Component {
  state = { selectedItem: this.props.selectedItem };
  handleImageClick = e => {
    this.props.showImageModal(e.target.querySelector("img").src);
  };
  selectItem = itemNum => {
    this.setState({ selectedItem: itemNum });
  };
  render() {
    //const { photos,showThumb } = this.props;
    const { selectedItem } = this.state;
    const { showThumbs, autoPlay } = this.props;
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
        onClickItem={e => this.selectItem(e)}
      >
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo1"
            src={require("../../images/girl1.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo2"
            src={require("../../images/girl2.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo3"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo4"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo1"
            src={require("../../images/girl1.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo2"
            src={require("../../images/girl2.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
          <img
            alt="photo3"
            src={require("../../images/girl3.jpg")}
            style={{ width: "23vw", height: "35vh" }}
          />
        </div>
        <div onClick={e => this.handleImageClick(e)}>
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
