import React from "react";
import { Image } from "react-konva";

class KonvaImage extends React.Component {
  state = {
    image: null
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
    const { name, ...rest } = this.props;
    return <Image {...rest} name={name} draggable image={this.state.image} />;
  }
}

export default KonvaImage;
