import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Signout from "../components/Auth/Signout";

const Navbar = ({ session }) => (
  <nav className="header">
    {session && session.currentuser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth />
    )}
  </nav>
);

const NavbarUnAuth = () => (
  <ul>
    <li>
      <NavLink to="/signin">Signin</NavLink>
    </li>
    <li>
      <NavLink to="/signup">Signup</NavLink>
    </li>
  </ul>
);

const NavbarAuth = ({ session }) => (
  <Fragment>
    <ul>
      <li>{""}</li>
      <li>
        <NavLink to="/search">Meet Members</NavLink>
      </li>
      <li>
        <NavLink to="/event/search">Events</NavLink>
      </li>
      <li>
        <NavLink to="/editprofile">Edit Profile</NavLink>
      </li>
      <li>
        <NavLink to="/myaccount">My Account</NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
  </Fragment>
);

export default Navbar;
