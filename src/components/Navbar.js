import React, { Fragment } from "react";
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

const NavbarAuth = ({ session }) => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={["1"]}
    style={{ lineHeight: "64px" }}
  >
    <Menu.Item key="1">
      <NavLink to="/search">Meet Members</NavLink>
    </Menu.Item>
    <Menu.Item key="2">
      <NavLink to="/event/search">Go to Events</NavLink>
    </Menu.Item>
    <Menu.Item key="3">
      <NavLink to="/editprofile">Edit Profile</NavLink>
    </Menu.Item>
    <Menu.Item key="4">
      <NavLink to="/myaccount">My Account</NavLink>
    </Menu.Item>
  </Menu>
);

export default Navbar;
