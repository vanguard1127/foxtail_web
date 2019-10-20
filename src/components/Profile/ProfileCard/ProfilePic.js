import React, { Component } from "react";
import LoadProfileImg from "../../../assets/img/elements/load-profile.png";

class ProfilePic extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profilePic } = this.props;
    return (
      <div className="avatar">
        <img src={profilePic !== "" && profilePic} alt="" />
        <img src={LoadProfileImg} alt="" />
      </div>
    );
  }
}

export default ProfilePic;
