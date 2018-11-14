import React from "react";
import { Image } from "react-konva";
import PropTypes from "prop-types";

class SourceImage extends React.Component {
  static propTypes = {
    sourceImageObject: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
  };

  state = {
    image: null,
    imageBase64: ""
  };

  componentDidMount() {
    this.readFile();
  }
  // UNSAFE_componentWillReceiveProps() {
  //   this.readFile();
  // }

  readFile = () => {
    const file = this.props.sourceImageObject.originFileObj;
    // console.log("SourceIMage", file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      this.setState({ imageBase64: e.target.result }, this.setImage);
    };
  };

  setImage = () => {
    const image = new window.Image();
    image.src = this.state.imageBase64;
    if (this.props.width) image.width = this.props.width;
    if (this.props.height) image.height = this.props.height;
    const _this = this;
    image.onload = function() {
      _this.setState({
        image: image,
        type: "SET_IMAGE_SIZE",
        width: this.width,
        height: this.height
      });
    };
  };

  render() {
    return <Image image={this.state.image} />;
  }
}

export default SourceImage;
