import React, { Component } from "react";

class ProfilePic extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profilePic } = this.props;
    return (
      <div className="avatar">
        <img
          src={
            profilePic !== ""
              ? profilePic
              : process.env.PUBLIC_URL + "/assets/img/no-profile.png"
          }
          alt=""
        />
      </div>
    );
  }
}

export default ProfilePic;
