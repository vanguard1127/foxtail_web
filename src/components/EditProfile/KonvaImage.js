import React from 'react';
import { Image } from 'react-konva';
import yoda from './yodaX.jpg';

class KonvaImage extends React.Component {
  state = {
    image: null
  };

  componentDidMount() {
    const image = new window.Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = this.props.src || yoda;
    image.onload = () => {
      this.setState({
        image: image
      });
    };
  }

  render() {
    const { name, ...rest } = this.props;
    return <Image {...rest} name={name} draggable image={this.state.image}/>;
  }
}

export default KonvaImage;
