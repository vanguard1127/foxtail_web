import React, { PureComponent } from 'react';
import MyAccountMenu from './MyAccountMenu';
import Menu from '../common/Menu';
class MyAccountItem extends PureComponent {
  render() {
    const { currentuser, setRef } = this.props;
    if (currentuser === undefined) {
      return null;
    }
    return (
      <Menu
        menuOpener={
          <span data-name="myaccount" ref={setRef}>
            <span className="avatar">
              <img src={currentuser.profilePic} alt="" />
            </span>
            <span className="username">{currentuser.username}</span>
          </span>
        }
      >
        <MyAccountMenu />
      </Menu>
    );
  }
}

export default MyAccountItem;
