import React, { PureComponent } from 'react';
import ProfileInfoBox from './ProfileInfoBox';
import DesiresBlock from './DesiresBlock';

class ProfileInfoDiv extends PureComponent {
  render() {
    const { profile, t } = this.props;
    return (
      <div className="data">
        <ProfileInfoBox
          users={profile.users}
          online={profile.showOnline && profile.online}
          t={t}
        />
        <DesiresBlock desires={profile.desires} t={t} />
      </div>
    );
  }
}

export default ProfileInfoDiv;
