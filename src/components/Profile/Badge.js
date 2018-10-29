import React, { Component } from "react";
import { Icon } from "antd";

class Badge extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <Icon type="safety-certificate" theme="twoTone" />;
  }
}

export default Badge;
