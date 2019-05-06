import React, { PureComponent } from "react";
import Avatar from "react-avatar";

import { preventContextMenu } from "../../utils/image";

class ProfilePic extends PureComponent {
  render() {
    const { profilePic, ErrorBoundary, history, id } = this.props;
    return (
      <ErrorBoundary>
        <div className="profile-picture-content">
          <div
            className="picture"
            onClick={() => history.push("/profile/" + id)}
          >
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
