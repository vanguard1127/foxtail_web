import React, { PureComponent } from "react";
import Avatar from "react-avatar";
import defaultPro from "../../assets/img/elements/defaultPro.png";

class ProfilePic extends PureComponent {
  render() {
    const {
      profilePic,
      ErrorBoundary,
      history,
      id,
      removeProfilePic,
      t
    } = this.props;

    return (
      <ErrorBoundary>
        <div className="profile-picture-content">
          <div className="picture">
            <Avatar
              size="90"
              src={profilePic !== "" ? profilePic : defaultPro}
              round
              onClick={() => history.push("/member/" + id)}
            />
            {profilePic && (
              <div className="deleteProfile" onClick={removeProfilePic}>
                {t("common:remove")}
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfilePic;
