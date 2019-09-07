import React from "react";
import i18next from "i18next";
const NotFound = () => (
  <section className="not-found" style={{ display: "block" }}>
    <div className="container">
      <div className="col-md-12">
        <div className="icon">
          <i className="nico cogs" />
        </div>
        <span className="head">{i18next.t("Uh-oh...")}</span>
        <span className="description">
          {i18next.t(
            "We're experiencing some technical difficulties. Please come back later."
          )}
        </span>
      </div>
    </div>
  </section>
);

export default NotFound;
