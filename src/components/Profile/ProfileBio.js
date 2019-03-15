import React, { Component } from 'react';
class ProfileBio extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { about, t } = this.props;
    return (
      <div className="user-bio">
        <div className="profile-head">{t('bio')}</div>
        <p>{about ? about : t('nobiomsg')}</p>
      </div>
    );
  }
}

export default ProfileBio;
