import React from "react";

const Menu = ({ coupleModalToggle, couplePartner, blackModalToggle, t }) => {
  return (
    <div className="menu">
      <ul>
        <li className="active">
          <span>{t("My Account")}</span>
        </li>
        <li>
          <span onClick={() => coupleModalToggle()}>
            {couplePartner === null ? t("Add Couple Partner") : couplePartner}
          </span>
        </li>
        <li>
          <span onClick={() => blackModalToggle()}>
            {t("Become a Black Member")}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
