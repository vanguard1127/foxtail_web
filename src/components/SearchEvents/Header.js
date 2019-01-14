import React from "react";
const EventHeader = ({ t }) => {
  return (
    <section className="breadcrumb">
      <div className="container">
        <div className="col-md-12">
          <span className="head">{t("Go to Events")}</span>
          <span className="title">{t("eventSubTitle")}</span>
        </div>
      </div>
    </section>
  );
};

export default EventHeader;
