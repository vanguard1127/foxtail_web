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

  handleDragStart = e => {
    const shapeName = e.target.attrs.name;
    if (this.state.selectedShapeName !== shapeName) {
      if (this.mounted) {
        this.setState({ selectedShapeName: shapeName });
      }
    }
  };

  render() {
    const { name, x, y, width, height, rotation } = this.props;

    return (
      <Image
        x={x}
        y={y}
        width={width}
        height={height}
        name={name}
        rotation={rotation}
        draggable
        image={this.state.image}
      />
    );
  }
}

export default KonvaImage;
