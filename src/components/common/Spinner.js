import React, { Component } from "react";
// First way to import
import { PacmanLoader } from "react-spinners";

class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMessage: false,
      loading: true
    };
    this.enableMessage = this.enableMessage.bind(this);

    this.timer = setTimeout(this.enableMessage, 250);
  }

  enableMessage() {
    this.setState({ displayMessage: true });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { displayMessage } = this.state;

    if (!displayMessage) {
      return null;
    }
    return (
      <div
        className="sweet-loading"
        style={{
          display: "flex",
          flex: "1",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <PacmanLoader
          sizeUnit={"px"}
          size={15}
          color={"#5F00A4"}
          loading={this.state.loading}
        />
        <br />
        <div style={{ marginLeft: "4vw" }}>{this.props.message}</div>
      </div>
    );
  }
}
export default Spinner;
