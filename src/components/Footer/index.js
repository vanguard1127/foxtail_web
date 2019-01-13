import React from "react";

import { withNamespaces } from "react-i18next";
const Footer = ({ t }) => {
  return (
    <footer>
      <div className="brand">
        <div className="container">
          <div className="col-md-12">
            <div className="logo">
              <span />
            </div>
            <div className="medias">
              <ul>
                <li className="facebook">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="twitter">
                  <span>
                    <i />
                  </span>
                </li>
                <li className="instagram">
                  <span>
                    <i />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <div className="col-md-12">
            <span className="text">
              © 2019 - 2020 Foxtail App Inc.{" "}
              {t("Registered in one or more countries")}.
            </span>
            <div className="menu">
              <ul>
                <li>
                  <span>{t("Terms & Conditions")}</span>
                </li>
                <li>
                  <span>{t("Privacy Policy")}</span>
                </li>
                <li>
                  <span>{t("Contact Us")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default withNamespaces()(Footer);
