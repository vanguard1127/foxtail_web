import React, { Component } from "react";
import { css } from "@emotion/core";
// First way to import
import { PacmanLoader } from "react-spinners";

class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <div className="sweet-loading">
        <PacmanLoader
          sizeUnit={"px"}
          size={15}
          color={"#5F00A4"}
          loading={this.state.loading}
        />
        <br />
        {this.props.message}
      </div>
    );
  }
}
export default Spinner;
