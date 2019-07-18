import React, { Component } from "react";
import ProfilePic from "./ProfilePic";
import ProfileActions from "./ProfileActions";
class ProfileCard extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.liked !== nextProps.liked ||
      this.props.msgd !== nextProps.msgd
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      profile,
      likeProfile,
      showMsgModal,
      t,
      ErrorBoundary,
      liked,
      msgd,
      isSelf
    } = this.props;
    const { profilePic, id, users } = profile;

    let badge = "";
    if (
      users.every(
        user =>
          user.verifications.photo === true && user.verifications.std === true
      )
    ) {
      badge = "full-verified";
    } else if (users.every(user => user.verifications.photo)) {
      badge = "std-verified";
    } else if (users.every(user => user.verifications.std === true)) {
      badge = "profile-verified";
    }

    return (
      <ErrorBoundary>
        <div className="avatar-content">
          <div className={"avatar-card " + badge}>
            <ProfilePic profilePic={profilePic} />
            {!isSelf && (
              <ProfileActions
                profileID={id}
                likeProfile={likeProfile}
                showMsgModal={showMsgModal}
                t={t}
                liked={liked}
                msgd={msgd}
              />
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileCard;
