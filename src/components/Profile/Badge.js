import React, { Component } from "react";
import { Icon } from "antd";

class Badge extends Component {
  render() {
    if (this.props.type === "STD") {
      return <Icon type="safety-certificate" theme="twoTone" />;
    } else if (this.props.type === "Photo") {
      return <Icon type="camera" theme="twoTone" />;
    }
    return null;
  }
}

export default Badge;
