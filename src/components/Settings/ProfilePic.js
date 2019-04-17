import React, { PureComponent } from "react";
import Avatar from "react-avatar";

import { preventContextMenu } from "../../utils/image";

class ProfilePic extends PureComponent {
  render() {
    console.log("ProPic");
    const { profilePic, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className="profile-picture-content">
          <div className="picture">
            <Avatar
              size="90"
              src={profilePic}
              round
              onContextMenu={preventContextMenu}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfilePic;
