import React from "react";

const Menu = ({ coupleModalToggle, couplePartner, blackModalToggle }) => {
  return (
    <div className="menu">
      <ul>
        <li className="active">
          <span>My Account</span>
        </li>
        <li>
          <span onClick={() => coupleModalToggle()}>
            {couplePartner === null ? "Add Couple Partner" : couplePartner}
          </span>
        </li>
        <li>
          <span onClick={() => blackModalToggle()}>Become a Black Member</span>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
