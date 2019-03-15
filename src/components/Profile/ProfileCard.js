import React, { Component } from 'react';
import ProfilePic from './ProfilePic';
import ProfileActions from './ProfileActions';
class ProfileCard extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profile, setProfile, likeProfile, showMsgModal, t } = this.props;

    const { profilePic, id } = profile;
    return (
      <div className="avatar-content">
        <div className="avatar-card">
          <ProfilePic profilePic={profilePic} />
          <ProfileActions
            profileID={id}
            setProfile={setProfile}
            likeProfile={likeProfile}
            showMsgModal={showMsgModal}
            t={t}
          />
        </div>
      </div>
    );
  }
}

export default ProfileCard;
