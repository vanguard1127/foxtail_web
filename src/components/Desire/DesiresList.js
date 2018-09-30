import React, { Component } from "react";
import { Button } from "antd";

class DesiresList extends Component {
  state = {};
  render() {
    const { desires } = this.props;
    return (
      <div>
        {desires.map(desire => (
          <Button type="dashed">{desire}</Button>
        ))}
      </div>
    );
  }
}

export default DesiresList;
