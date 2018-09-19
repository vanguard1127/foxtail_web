import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Signout from "../components/Auth/Signout";

const Navbar = ({ session }) => (
  <nav>
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
      <NavLink to="/" exact>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to="/search">Search</NavLink>
    </li>
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
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/search">Search</NavLink>
      </li>
      <li>
        <NavLink to="/event/add">Add Event</NavLink>
      </li>
      <li>
        <NavLink to="/myaccount">My Account</NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
    <h4>
      Welcome, <strong>{session.currentuser.username}</strong>
    </h4>
  </Fragment>
);

export default Navbar;
