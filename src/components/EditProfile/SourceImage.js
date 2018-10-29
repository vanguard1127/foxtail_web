import React, { Component } from "react";
import Konva from "konva";
import { render } from "react-dom";
import { Image } from "react-konva";

class SourceImage extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    const image = new window.Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = this.props.imageSrc;
    if (this.props.width) image.width = this.props.width;
    if (this.props.height) image.height = this.props.height;
    const _this = this;
    image.onload = function() {
      console.log(this.width, this.height);
      _this.setState({
        image: image,
        type: "SET_IMAGE_SIZE",
        width: this.width,
        height: this.height
      });
    };
  }

  render() {
    return <Image image={this.state.image} />;
  }
}

export default SourceImage;
