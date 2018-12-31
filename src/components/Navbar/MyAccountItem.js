import React from "react";
import { NavLink } from "react-router-dom";

const MyAccountItem = () => {
  return (
    <span>
      <span className="avatar">
        <img
          src={process.env.PUBLIC_URL + "/assets/img/usr/avatar/1001@2x.png"}
          alt=""
        />
      </span>
      <span className="username">
        <NavLink to="/settings">John Doe</NavLink>
      </span>
    </span>
  );
};

export default MyAccountItem;
