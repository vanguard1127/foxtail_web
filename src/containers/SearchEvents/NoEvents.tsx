import React from "react";
import { WithT } from "i18next";

const NoEvents: React.FC<WithT> = ({ t }) => {
  return (
    <section
      className="not-found"
      style={{
        display: "inline-block",
        position: "unset",
        top: "unset",
        transform: "unset"
      }}
    >
      <div className="container">
        <div className="col-md-12">
          <div className="icon">
            <i className="nico event" />
          </div>
          <span className="head">{t("noeventavailable")}</span>
          <span className="description">{t("noeventavailabledes")}</span>
        </div>
      </div>
    </section>
  );
};

export default NoEvents;
