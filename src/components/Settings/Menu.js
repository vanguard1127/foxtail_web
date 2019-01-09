import React from "react";

const Menu = ({ selected, coupleModalToggle, couplePartner }) => {
  return (
    <div className="menu">
      <ul>
        <li className="active">
          <a href="#">My Account</a>
        </li>
        <li>
          <a href="#" onClick={() => coupleModalToggle()}>
            {couplePartner === null ? "Add Couple Partner" : couplePartner}
          </a>
        </li>
        <li>
          <a href="#">Become a Black Member</a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
