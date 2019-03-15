import React, { Component } from 'react';
class ProfileActions extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { profile, setProfile, likeProfile, showMsgModal, t } = this.props;

    return (
      <div className="functions">
        <div
          className="btn send-msg"
          onClick={async () => {
            await setProfile(profile);
            await showMsgModal();
          }}
        >
          {t('common:sendmsg')}
        </div>
        <div
          className="btn heart"
          onClick={async () => {
            await setProfile(profile);
            await likeProfile();
          }}
        />
      </div>
    );
  }
}

export default ProfileActions;
