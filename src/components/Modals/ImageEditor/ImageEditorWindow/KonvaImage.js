import React, { PureComponent } from 'react';
import { Image } from 'react-konva';

class KonvaImage extends PureComponent {
  state = {
    image: null
  };

  componentDidMount() {
    // console.log(this.props.x , this.props.y)
    const importImage = require('./' + this.props.src);
    const image = new window.Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = importImage;
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

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
        image={this.state.image}
      />
    );
  }
}

export default KonvaImage;
