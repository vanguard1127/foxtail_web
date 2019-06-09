import React, { PureComponent } from "react";
import { Image } from "react-konva";

class SourceImage extends PureComponent {
  state = {
    image: null,
    isDragging: false
  };
  stageRef = null;
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
    console.log(e.target);
    var x_pos = this.props.x_pos + e.target.x();
    var xdiff = e.target.x();
    var y_pos = this.props.y_pos + e.target.y();
    console.log(
      "props x_pos",
      this.props.x_pos,
      "ImgX",
      xdiff,
      "New group X:",
      x_pos
    );
    const canvasWidth = this.props.canvasWidth;
    const canvasHeight = this.props.canvasHeight;
    const rotation = this.props.rotation % 360;
    const width =
      rotation == 0 || rotation == 180 ? this.props.width : this.props.height;
    const height =
      rotation == 0 || rotation == 180 ? this.props.height : this.props.width;
    // const offsetX = width / 2;
    // const offsetY = height / 2;
    // if (x_pos - offsetX < 0) {
    //   x_pos = offsetX;
    // } else {
    //   if (x_pos - offsetX + width > canvasWidth) {
    //     console.log("1");
    //     x_pos = canvasWidth - width + offsetX;
    //   }
    // }
    // if (y_pos - offsetY < 0) {
    //   y_pos = offsetY;
    // } else {
    //   console.log("2");
    //   if (y_pos - offsetY + height > canvasHeight) {
    //     y_pos = canvasHeight - height + offsetY;
    //   }
    // }
    // e.target.to({
    //   duration: 0,
    //   x: x_pos,
    //   y: y_pos
    // });
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
    return (
      <Image
        image={this.state.image}
        width={this.props.width}
        height={this.props.height}
        //draggable
        // onDragStart={this.handleDragStart}
        // onDragEnd={this.handleDragEnd}
        offsetX={this.props.width / 2}
        offsetY={this.props.height / 2}
      />
    );
  }
}

export default SourceImage;
