import React, { PureComponent } from "react";
import { Image } from "react-konva";

class KonvaImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      selectedShapeName: "",
      isLastImage: props.isLastImage
    };
  }

  componentDidMount() {
    const importImage = require("./" + this.props.src);
    const image = new window.Image();
    // here we've taken 30% size of image and lessthan 400 widht - 20%
    const konvaImageScale = window.innerWidth > 400 ? 0.2 : 0.1;

    image.setAttribute("crossOrigin", "anonymous");
    image.src = importImage;
    image.onload = () => {
      this.setState({
        image: image,
        imageWidth: this.props.isLastImage
          ? +((image.width / this.props.scale) * konvaImageScale).toFixed(2)
          : +(image.width * konvaImageScale).toFixed(2),
        imageHeight: this.props.isLastImage
          ? +((image.height / this.props.scale) * konvaImageScale).toFixed(2)
          : +(image.height * konvaImageScale).toFixed(2)
      });
    };
  }

  render() {
    const { name, rotation, onTouchStart } = this.props;

    return (
      <Image
        x={-(this.state.imageWidth / 2)}
        y={-(this.state.imageHeight / 2)}
        width={this.state.imageWidth}
        height={this.state.imageHeight}
        name={name}
        rotation={rotation}
        draggable
        image={this.state.image}
        onTouchStart={onTouchStart}
      />
    );
  }
}

export default KonvaImage;
