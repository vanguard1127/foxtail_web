import React, { Component } from "react";
import RulesModal from "../Modals/Rules";
import ContactUsModal from "../Modals/ContactUs";

import { withTranslation } from "react-i18next";

class Footer extends Component {
  state = { showRulesModal: false, showContactModal: false };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showRulesModal !== nextState.showRulesModal ||
      this.state.showContactModal !== nextState.showContactModal ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }
  toggleRuleModal = () => {
    this.setState({ showRulesModal: !this.state.showRulesModal });
  };

  toggleContactModal = () => {
    this.setState({ showContactModal: !this.state.showContactModal });
  };

  render() {
    const { t, tReady } = this.props;
    const { showRulesModal, showContactModal } = this.state;
    if (!tReady) {
      return null;
    }
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
                    <a
                      href="https://fb.me/foxtailapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span aria-label="facebook share">
                        <i />
                      </span>
                    </a>
                  </li>
                  <li className="twitter">
                    <a
                      href="https://www.facebook.com/Foxtail-1629223060455218/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span aria-label="twitter share">
                        <i />
                      </span>
                    </a>
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
                © {new Date().getFullYear()} Foxtail App Inc. {t("register")}.
              </span>
              <div className="menu">
                <ul>
                  <li>
                    <span onClick={this.toggleRuleModal}>{t("Rules")}</span>
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
                    <span onClick={this.toggleContactModal}>
                      {t("contact")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {showRulesModal && <RulesModal close={this.toggleRuleModal} t={t} />}
        {showContactModal && (
          <ContactUsModal
            close={this.toggleContactModal}
            header={t("common:Send us a Message")}
            description={t("common:Questions/Comments/Suggestions/etc...")}
            okText={t("common:Send")}
          />
        )}
      </footer>
    );
  }
}

export default withTranslation("footer")(Footer);
