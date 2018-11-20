import React, { Component } from "react";
import moment from "moment";
import Badge from "./Badge";

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
          <Badge type={!user.verifications.std && "STD"} />
          <Badge type={user.verifications.photo && "Photo"} />
        </div>
      </div>
    );
  }
}

export default NamePlate;
