import React, { PureComponent } from 'react';
import { Image } from 'react-konva';
import PropTypes from 'prop-types';

class SourceImage extends PureComponent {
  static propTypes = {
    sourceImageObject: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
  };

  state = {
    image: null,
    imageBase64: '',
    isDragging: false
  };

  componentDidMount() {
    this.readFile();
  }

  readFile = () => {
    const file = this.props.sourceImageObject;
    //const file = this.props.sourceImageObject.originFileObj;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      this.setState({ imageBase64: e.target.result }, this.setImage);
    };
  };

  setImage = () => {
    const image = new window.Image();
    image.src = this.state.imageBase64;
    const _this = this;
    //if (this.props.width) image.width = this.props.width;
    //if (this.props.height) image.height = this.props.height;
    image.onload = function() {
      const ratio = image.width / image.height;
      if (image.width <= image.height) {
        image.width = _this.props.width;
        image.height = image.width / ratio;
      } else {
        image.height = _this.props.height;
        image.width = image.height * ratio;
      }
      _this.setState({
        image: image,
        type: 'SET_IMAGE_SIZE',
        width: image.width,
        height: image.height
      });
      console.log(_this.state.width);
    };
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
    } else if (left_pos + scaleWidth < this.props.width) {
      e.target.to({
        duration: 0,
        x: this.props.width - scaleWidth
      });
    }
    if (e.target.y() > 0) {
      e.target.to({
        duration: 0,
        y: 0
      });
    } else if (right_pos + scaleHeight < this.props.height) {
      e.target.to({
        duration: 0,
        y: this.props.height - scaleHeight
      });
    }
  };

  render() {
    return (
      <Image
        image={this.state.image}
        width={this.state.width * this.props.scale}
        height={this.state.height * this.props.scale}
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
