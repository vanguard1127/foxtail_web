import React from "react";

const Menu = ({
  coupleModalToggle,
  couplePartner,
  blackModalToggle,
  t,
  flashCpl
}) => {
  return (
    <div className="menu">
      <ul>
        <li className="active">
          <span>{t("common:myaccount")}</span>
        </li>
        <li>
          <span
            onClick={() => coupleModalToggle()}
            className={flashCpl ? "flashCpl" : null}
          >
            {couplePartner === null ? t("common:addcoup") : couplePartner}
          </span>
        </li>
        <li>
          <span onClick={() => blackModalToggle()}>
            {t("common:becomeblk")}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
