import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "./LogoutLink";

const MyAccountMenu = ({ currentuser, t }) => {
  return (
    <div className="toggle">
      <div className="dropdown hidden-mobile open">
        <ul>
          <li>
            <NavLink to="/settings">{t("common:myaccount")}</NavLink>
          </li>
          <li>
            <NavLink to="/settings">{t("common:addcoup")}</NavLink>
          </li>
          <li className="border">
            <NavLink to="/settings">{t("common:becomeblk")}</NavLink>
          </li>
          <li>
            <Logout t={t} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyAccountMenu;
