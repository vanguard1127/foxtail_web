import React, { PureComponent } from 'react';

const preventContextMenu = e => {
  e.preventDefault();
  alert(
    'Right-click disabled: Saving images on Foxtail will result in your account being banned.'
  );
};

class ProfilePic extends PureComponent {
  render() {
    const { profilePic } = this.props;
    return (
      <div className="image">
        <img
          src={
            profilePic !== ''
              ? profilePic
              : 'assets/img/usr/medium-avatar/1001@2x.png'
          }
          alt=""
          onContextMenu={preventContextMenu}
        />
      </div>
    );
  }
}

export default ProfilePic;
