import React, { Component } from "react";

class ProfilePic extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profilePic, preventContextMenu } = this.props;
    return (
      <div className="avatar">
        <img
          src={
            profilePic !== ""
              ? profilePic
              : process.env.PUBLIC_URL + "/assets/img/elements/no-profile.png"
          }
          alt=""
          onContextMenu={preventContextMenu}
        />
      </div>
    );
  }
}

export default ProfilePic;
