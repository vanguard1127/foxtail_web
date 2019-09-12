import React, { PureComponent } from "react";
const NoProfileImg = require("../../../../src/assets/img/elements/no-profile.png");
class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="image">
        <img src={profilePic !== "" ? profilePic : NoProfileImg} alt="" />
      </div>
    );
  }
}

export default ProfilePic;
