import React, { PureComponent } from "react";
import { Image } from "react-konva";
import PropTypes from "prop-types";

class SourceImage extends PureComponent {
  //   static propTypes = {
  //     sourceImageObject: PropTypes.object,
  //     width: PropTypes.number,
  //     height: PropTypes.number
  //   };

  state = {
    image: null,
    imageBase64: "",
    isDragging: false
  };

  componentDidMount() {
    this.image = new window.Image();
    this.image.src = URL.createObjectURL(this.props.sourceImageObject);
    this.image.addEventListener("load", this.imageLoad);
  }

  componentWillUnmount() {
    this.image.removeEventListener("load", this.imageLoad);
  }

  imageLoad = () => {
    this.setState({
      image: this.image
    });
  };

  handleDragStart = e => {
    this.setState({
      isDragging: true
    });
  };

  handleDragEnd = e => {
    this.setState({
      isDragging: false
    });
    const left_pos = e.target.x();
    const right_pos = e.target.y();
    const scaleWidth = this.state.width * this.props.scale;
    const scaleHeight = this.state.height * this.props.scale;
    if (left_pos > 0) {
      e.target.to({
        duration: 0,
        x: 0
      });
    } else if (left_pos + scaleWidth < this.state.width) {
      e.target.to({
        duration: 0,
        x: this.state.width - scaleWidth
      });
    }
    if (e.target.y() > 0) {
      e.target.to({
        duration: 0,
        y: 0
      });
    } else if (right_pos + scaleHeight < this.state.height) {
      e.target.to({
        duration: 0,
        y: this.state.height - scaleHeight
      });
    }
  };

  render() {
    return (
      <Image
        image={this.state.image}
        width={this.props.width}
        height={this.props.height}
        x={this.props.x_pos}
        y={this.props.y_pos}
        draggable
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    );
  }
}

export default SourceImage;
