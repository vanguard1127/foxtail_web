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
    const { currentuser, setRef, t } = this.props;
    if (currentuser === undefined) {
      return null;
    }

    return (
      <Menu
        menuOpener={
          <div data-name="myaccount" ref={setRef} style={{ display: "flex" }}>
            <span className="avatar">
              <img src={currentuser.profilePic} alt="" />
            </span>
            {currentuser.coupleProfileName ? (
              <span className="username">{currentuser.coupleProfileName}</span>
            ) : (
              <span className="username">{currentuser.username}</span>
            )}
          </div>
        }
      >
        <MyAccountMenu
          isCouple={currentuser.coupleProfileName !== null ? true : false}
          isBlack={currentuser.blackMember.active ? true : false}
          t={t}
        />
      </Menu>
    );
  }
}

export default MyAccountItem;
