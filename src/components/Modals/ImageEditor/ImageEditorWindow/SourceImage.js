import React, { PureComponent } from "react";
import { Image } from "react-konva";

class SourceImage extends PureComponent {
  state = {
    image: null,
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

  render() {
    return (
      <Image
        image={this.state.image}
        width={this.props.width}
        height={this.props.height}
        onDragEnd={this.handleDragEnd}
        offsetX={this.props.width / 2}
        offsetY={this.props.height / 2}
      />
    );
  }
}

export default SourceImage;
