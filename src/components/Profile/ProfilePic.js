import React, { PureComponent } from 'react';
import { preventContextMenu } from '../../utils/image';

class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="avatar">
        <img
          src={
            profilePic !== ''
              ? profilePic
              : process.env.PUBLIC_URL +
                '/assets/img/usr/big-avatar/1003@2x.png'
          }
          alt=""
          onContextMenu={preventContextMenu}
        />
      </div>
    );
  }
}

export default ProfilePic;
