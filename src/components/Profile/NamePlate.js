import React, { Component } from "react";
import moment from "moment";

class NamePlate extends Component {
  state = {};
  render() {
    const { user } = this.props;
    return (
      <div style={{ display: "flex" }}>
        <div>
          {user.username},{moment().diff(user.dob, "years")} {user.gender}
        </div>
        <div style={{ marginLeft: "5px", float: "left" }}>
          <img
            alt="badge"
            src={require("../../images/badge.JPG")}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
      </div>
    );
  }
}

export default NamePlate;
