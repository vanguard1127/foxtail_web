import React from "react";

const Header = ({ close, t }) => {
  return (
    <div className="m-head">
      <span className="heading">{t("couppro")}</span>
      <span className="title">{t("coupshare")}</span>
      <span className="close" onClick={() => close()} />
    </div>
  );
};

export default Header;
