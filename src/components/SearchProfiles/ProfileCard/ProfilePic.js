import React, { PureComponent } from "react";
import { preventContextMenu } from "../../../utils/image";

class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="image">
        <img
          src={
            profilePic !== ""
              ? profilePic
              : "assets/img/usr/medium-avatar/1001@2x.png"
          }
          alt=""
          onContextMenu={preventContextMenu}
        />
      </div>
    );
  }
}

export default ProfilePic;
