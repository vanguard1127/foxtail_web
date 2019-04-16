import React, { Component } from "react";
import { preventContextMenu } from "../../utils/image";

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
              : process.env.PUBLIC_URL +
                "/assets/img/usr/big-avatar/1003@2x.png"
          }
          alt=""
          onContextMenu={preventContextMenu}
        />
      </div>
    );
  }
}

export default ProfilePic;
