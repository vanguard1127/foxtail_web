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

  handleDragEnd = e => {
    this.setState({
      isDragging: false
    });
    var x_pos = e.target.x();
    var y_pos = e.target.y();
    const canvasWidth = this.props.canvasWidth;
    const canvasHeight = this.props.canvasHeight;
    const rotation = this.props.rotation % 360;
    const width =
      rotation == 0 || rotation == 180 ? this.props.width : this.props.height;
    const height =
      rotation == 0 || rotation == 180 ? this.props.height : this.props.width;
    const offsetX = width / 2;
    const offsetY = height / 2;
    if (x_pos - offsetX < 0) {
      x_pos = offsetX;
    } else {
      if (x_pos - offsetX + width > canvasWidth) {
        x_pos = canvasWidth - width + offsetX;
      }
    }
    if (y_pos - offsetY < 0) {
      y_pos = offsetY;
    } else {
      if (y_pos - offsetY + height > canvasHeight) {
        y_pos = canvasHeight - height + offsetY;
      }
    }
    e.target.to({
      duration: 0,
      x: x_pos,
      y: y_pos
    });
    this.props.dragComplete(x_pos, y_pos);

    // if (left_pos > 0) {
    //   e.target.to({
    //     duration: 0,
    //     x: 0
    //   });
    // } else if (left_pos + width < this.state.width) {
    //   e.target.to({
    //     duration: 0,
    //     x: this.state.width - scaleWidth
    //   });
    // }
    // if (e.target.y() > 0) {
    //   e.target.to({
    //     duration: 0,
    //     y: 0
    //   });
    // } else if (right_pos + scaleHeight < this.state.height) {
    //   e.target.to({
    //     duration: 0,
    //     y: this.state.height - scaleHeight
    //   });
    // }
  };

  render() {
    const { name } = this.props;
    //WIDTH OF STICKER === 400
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        name={name}
        draggable
        onDragEnd={this.handleDragEnd}
        image={this.state.image}
      />
    );
  }
}

export default KonvaImage;
