import React from "react";
import { WithT } from "i18next";

const NoLocation: React.FC<WithT> = ({ t }) => {
  return (
    <section className="not-found" style={{ display: "block" }}>
      <div className="container">
        <div className="col-md-12">
          <div className="icon">
            <i className="nico location" />
          </div>
          <span className="head">{t("Location not available.")}</span>
          <span className="description">
            {t(
              "Please enable location services on your device to see this page."
            )}
          </span>
        </div>
      </div>
    </section>
  );
};

export default NoLocation;
