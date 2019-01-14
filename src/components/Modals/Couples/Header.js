import React from "react";

const Header = ({ close, t }) => {
  return (
    <div className="m-head">
      <span className="heading">{t("Couple Profile Management")}</span>
      <span className="title">
        {t(
          "It is a long established fact that a reader will be distracted by the readable"
        )}
      </span>
      <span className="close" onClick={() => close()} />
    </div>
  );
};

export default Header;
