import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="col-md-5 hidden-mobile">
      <ul className="menu">
        <li>
          <NavLink to="/members">
            <span role="heading" aria-level={1}>
              {t("meetmembers")}
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/events">
            <span role="heading" aria-level={1}>
              {t("goevents")}
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            <span role="heading" aria-level={1}>
              {t("chat")}
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavLinks;
