import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "../Auth/LogoutLink";

const MyAccountMenu = ({ currentuser }) => {
  return (
    <div className="toggle">
      <div className="dropdown hidden-mobile open">
        <ul>
          <li>
            <NavLink to="/settings">My Account</NavLink>
          </li>
          <li>
            <NavLink to="/settings">Add Couple Partner</NavLink>
          </li>
          <li className="border">
            <NavLink to="/settings">Become a Black Member</NavLink>
          </li>
          <li>
            <Logout />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyAccountMenu;
