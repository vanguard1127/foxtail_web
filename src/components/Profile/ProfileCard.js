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
      setProfile,
      likeProfile,
      showMsgModal,
      t,
      ErrorBoundary,
      liked,
      msgd
    } = this.props;
    console.log("CH", liked, msgd);
    const { profilePic, id } = profile;
    return (
      <ErrorBoundary>
        <div className="avatar-content">
          <div className="avatar-card">
            <ProfilePic profilePic={profilePic} />
            <ProfileActions
              profileID={id}
              setProfile={setProfile}
              likeProfile={likeProfile}
              showMsgModal={showMsgModal}
              t={t}
              liked={liked}
              msgd={msgd}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default ProfileCard;
