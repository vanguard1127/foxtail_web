import React, { PureComponent } from "react";

class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="image">
        <img
          src={profilePic !== "" ? profilePic : "assets/img/no-profile.png"}
          alt=""
        />
      </div>
    );
  }
}

export default ProfilePic;
