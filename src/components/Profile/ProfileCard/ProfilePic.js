import React, { Component } from "react";

class ProfilePic extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profilePic } = this.props;
    return (
      <div className="avatar">
        <img src={profilePic !== "" && profilePic} alt="" />
      </div>
    );
  }
}

export default ProfilePic;
