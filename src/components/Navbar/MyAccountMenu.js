import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "./LogoutLink";

const MyAccountMenu = ({ currentuser, t }) => {
  return (
    <div className="toggle">
      <div className="dropdown hidden-mobile open">
        <ul>
          <li>
            <NavLink to="/settings">{t("My Account")}</NavLink>
          </li>
          <li>
            <NavLink to="/settings">{t("Add Couple Partner")}</NavLink>
          </li>
          <li className="border">
            <NavLink to="/settings">{t("Become a Black Member")}</NavLink>
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
