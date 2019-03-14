import React, { PureComponent } from 'react';

class ProfileActionBtns extends PureComponent {
  render() {
    const { profile, likeProfile, showMsgModal } = this.props;

    return (
      <div className="function">
        <div
          className="btn heart"
          onClick={() => {
            likeProfile(profile);
          }}
        />
        <div
          className="btn message"
          onClick={() => {
            showMsgModal(profile);
          }}
        />
      </div>
    );
  }
}

export default ProfileActionBtns;
