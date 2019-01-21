import React from "react";
import { NavLink } from "react-router-dom";
const InboxHeader = ({ t }) => {
  return (
    <section className="breadcrumb">
      <div className="container">
        <div className="col-md-12">
          <span className="head">{t("common:Inbox")}</span>
          <span className="title">
            {t("subtitle")} <NavLink to="/inbox">{t("rules")}</NavLink>.{" "}
          </span>
        </div>
      </div>
    </section>
  );
};

export default InboxHeader;
