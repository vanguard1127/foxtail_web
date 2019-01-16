import React from "react";
const InboxHeader = ({ t }) => {
  return (
    <section className="breadcrumb">
      <div className="container">
        <div className="col-md-12">
          <span className="head">{t("common:Inbox")}</span>
          <span className="title">
            {t("subtitle")} <span>{t("rules")}</span>.{" "}
          </span>
        </div>
      </div>
    </section>
  );
};

export default InboxHeader;
