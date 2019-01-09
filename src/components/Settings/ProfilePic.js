import React from "react";

const Menu = ({ selected }) => {
  return (
    <div className="menu">
      <ul>
        <li className="active">
          <a href="#">My Account</a>
        </li>
        <li>
          <a href="#">Add Couple Partner</a>
        </li>
        <li>
          <a href="#">Become a Black Member</a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
