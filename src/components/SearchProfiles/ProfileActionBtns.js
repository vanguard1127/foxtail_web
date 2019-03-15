import React, { Component } from 'react';

class ProfileActionBtns extends Component {
  shouldComponentUpdate() {
    return false;
  }
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
