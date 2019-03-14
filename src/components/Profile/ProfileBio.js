import React, { PureComponent } from 'react';
class ProfileBio extends PureComponent {
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
