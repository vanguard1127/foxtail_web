import React, { Component } from "react";
import NoProfileImg from "../../../assets/img/elements/no-profile.png";

class ProfilePic extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profilePic } = this.props;
    return (
      <div className="avatar">
        <img src={profilePic !== "" ? profilePic : NoProfileImg} alt="" />
      </div>
    );
  }
}

export default ProfilePic;
