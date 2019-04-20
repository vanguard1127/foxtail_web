import React, { Component } from "react";
import MyAccountMenu from "./MyAccountMenu";
import Menu from "../common/Menu";
class MyAccountItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.currentuser !== nextProps.currentuser) {
      return true;
    }
    return false;
  }
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
            {currentuser.coupleProfileName ? (
              <span className="username">{currentuser.coupleProfileName}</span>
            ) : (
              <span className="username">{currentuser.username}</span>
            )}
          </span>
        }
      >
        <MyAccountMenu
          isCouple={currentuser.coupleProfileName !== null ? true : false}
          isBlack={currentuser.blackMember.active ? true : false}
        />
      </Menu>
    );
  }
}

export default MyAccountItem;
