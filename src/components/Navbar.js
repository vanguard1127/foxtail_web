import React, { Fragment, Component } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "antd";

const Navbar = ({ session }) => (
  <Fragment>
    {session && session.currentuser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth />
    )}
  </Fragment>
);

const NavbarUnAuth = () => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={["1"]}
    style={{ lineHeight: "64px" }}
  >
    <Menu.Item key="1">
      <NavLink to="/signin">Signin</NavLink>
    </Menu.Item>
    <Menu.Item key="2">
      <NavLink to="/signup">Signup</NavLink>
    </Menu.Item>
  </Menu>
);

//TODO: check it not id and try to make recursive
class NavbarAuth extends Component {
  render() {
    let href = window.location.href.split("/");
    href = href[3].concat(href[4] ? "/" + href[4] : "");
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/"]}
        selectedKeys={["/" + href]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="/members">
          <NavLink to="/members">Meet Members</NavLink>
        </Menu.Item>
        <Menu.Item key="/events">
          <NavLink to="/events">Go to Events</NavLink>
        </Menu.Item>
        <Menu.Item key="/editprofile">
          <NavLink to="/editprofile">Edit Profile</NavLink>
        </Menu.Item>
        <Menu.Item key="/myaccount">
          <NavLink to="/myaccount">My Account</NavLink>
        </Menu.Item>
      </Menu>
    );
  }
}

export default Navbar;
