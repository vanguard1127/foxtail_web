import React, { Component } from "react";
import { css } from "@emotion/core";
// First way to import
import { PacmanLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  display: flex;
  justify-content: center;
`;

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
          css={override}
          sizeUnit={"px"}
          size={25}
          color={"#7506E4"}
          loading={this.state.loading}
        />
        {this.props.message}
      </div>
    );
  }
}
export default Spinner;
