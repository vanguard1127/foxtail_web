import React from "react";
const FooterLanding = ({
  t,
  tooltip,
  history,
  resetPhoneClick,
  resetPassClick,
  termsClick,
  toggleContactModal
}) => {
  return (
    <footer className="landing">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <span className="created">
                Foxtail © 2019 {t("Created by")} <span>Foxtail</span>
              </span>
            </div>
            <div className="offset-md-2 col-md-6">
              <div className="links">
                <ul>
                  <li>
                    <span onClick={resetPhoneClick}>{t("resetphone")}</span>
                  </li>
                  <li>
                    <span onClick={resetPassClick}>{t("resetpass")}</span>
                  </li>
                  <li style={{ zIndex: 0 }}>
                    {tooltip && (
                      <div className="tooltip">
                        <span className="tooltiptext show">
                          <div>
                            {" "}
                            <span onClick={() => history.push("/tos")}>
                              {t("common:Terms")}
                            </span>
                          </div>
                          <div>
                            <span onClick={() => history.push("/privacy")}>
                              {t("common:Privacy")}
                            </span>
                          </div>
                          <div>
                            <span onClick={() => history.push("/2257")}>
                              {t("common:2257Compliance")}
                            </span>
                          </div>
                          <div>
                            <span onClick={() => history.push("/antispam")}>
                              {t("antispam")}
                            </span>
                          </div>
                          <div>
                            <span
                              onClick={() => history.push("/lawenforcement")}
                            >
                              {t("lawenf")}
                            </span>
                          </div>
                        </span>
                      </div>
                    )}
                    <span onClick={termsClick}>
                      {t("common:Terms") + " "}
                      {tooltip ? "▽" : "△"}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => history.push("/faq")}>{t("FAQ")}</span>
                  </li>
                  <li>
                    <span onClick={() => history.push("/about")}>
                      {t("About")}
                    </span>
                  </li>
                  <li>
                    <span onClick={toggleContactModal}>{t("contact")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLanding;
