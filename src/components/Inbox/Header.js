import React from "react";
const InboxHeader = ({ t }) => {
  return (
    <section className="breadcrumb">
      <div className="container">
        <div className="col-md-12">
          <span className="head">{t("Inbox")}</span>
          <span className="title">
            {t("Chat with members, be yourself, have fun, follow the")}{" "}
            <a href={null}>{t("rules")}</a>.{" "}
          </span>
        </div>
      </div>
    </section>
  );
};

export default InboxHeader;
