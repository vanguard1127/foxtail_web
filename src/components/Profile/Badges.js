import React, { Component } from "react";

class Badges extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <img
          alt="badge"
          src={require("../../images/badge.JPG")}
          style={{ width: "30px", height: "30px", float: "left" }}
        />
      </div>
    );
  }
}

export default Badges;
