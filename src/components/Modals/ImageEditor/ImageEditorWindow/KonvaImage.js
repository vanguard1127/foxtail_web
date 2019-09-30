import React, { PureComponent } from "react";
import { Image } from "react-konva";

class KonvaImage extends PureComponent {
  state = {
    image: null,
    selectedShapeName: ""
  };

  componentDidMount() {
    const importImage = require("./" + this.props.src);
    const image = new window.Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = importImage;
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    const { image } = this.state;
    const { name, rotation, onTouchStart } = this.props;

    // here we've taken 30% size of image and lessthan 400 widht - 20%
    const konvaImageScale = window.innerWidth > 400 ? 0.3 : 0.2;

    let imageWidth = 0,
      imageHeight = 0;
    if (image !== null) {
      imageWidth = +(image.width * konvaImageScale).toFixed(2);
      imageHeight = +(image.height * konvaImageScale).toFixed(2);
    }

    return (
      <Image
        x={-(imageWidth / 2)}
        y={-(imageHeight / 2)}
        width={imageWidth}
        height={imageHeight}
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
