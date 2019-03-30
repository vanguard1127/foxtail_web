import React, { Component } from "react";
class ProfileBio extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { about, t, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className="user-bio">
          <div className="profile-head">{t("bio")}</div>
          <p>{about ? about : t("nobiomsg")}</p>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileBio;
