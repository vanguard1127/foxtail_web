import React, { Component } from "react";
class FooterLinks extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="copyright">
        <div className="container">
          <div className="col-md-12">
            <span className="text">
              © {new Date().getFullYear()} Foxtail App Inc. {t("register")}.
            </span>
            <div className="menu">
              <ul>
                <li>
                  <span onClick={this.props.toggleRuleModal}>{t("Rules")}</span>
                </li>
                <li>
                  <span onClick={() => window.location.replace("/faq")}>
                    {t("FAQ")}
                  </span>
                </li>
                <li>
                  <span onClick={() => window.location.replace("/tos")}>
                    {t("termscon")}
                  </span>
                </li>
                <li>
                  <span onClick={() => window.location.replace("/privacy")}>
                    {t("privacy")}
                  </span>
                </li>{" "}
                <li>
                  <span onClick={this.props.toggleContactModal}>
                    {t("contact")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FooterLinks;
