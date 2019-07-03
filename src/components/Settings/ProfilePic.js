import React, { PureComponent } from "react";
import Avatar from "react-avatar";

import { preventContextMenu } from "../../utils/image";

class ProfilePic extends PureComponent {
  render() {
    const {
      profilePic,
      ErrorBoundary,
      history,
      id,
      removeProfilePic
    } = this.props;
    return (
      <ErrorBoundary>
        <div className="profile-picture-content">
          <div className="picture">
            <Avatar
              size="90"
              src={profilePic}
              round
              onContextMenu={preventContextMenu}
              onClick={() => history.push("/member/" + id)}
            />
            {profilePic && (
              <div className="deleteProfile" onClick={removeProfilePic}>
                Remove
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfilePic;
