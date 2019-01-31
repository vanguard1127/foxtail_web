import React from 'react';
import Avatar from 'react-avatar';

import { preventContextMenu } from '../../utils/image';

const ProfilePic = ({ profilePic }) => {
  return (
    <div className="profile-picture-content">
      <div className="picture">
        <Avatar
          size="90"
          src={profilePic}
          round
          onContextMenu={preventContextMenu}
        />
      </div>
    </div>
  );
};

export default ProfilePic;
