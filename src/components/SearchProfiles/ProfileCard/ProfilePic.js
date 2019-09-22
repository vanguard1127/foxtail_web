import React, { PureComponent } from "react";
import { preventContextMenu } from "../../../utils/image";
const NoProfileImg = require("../../../../src/assets/img/elements/no-profile.png");
class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="image" onContextMenu={preventContextMenu}>
        <img src={profilePic !== "" ? profilePic : NoProfileImg} alt="" />
      </div>
    );
  }
}

export default ProfilePic;
