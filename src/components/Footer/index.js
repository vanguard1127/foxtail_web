import React, { Component } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";
import Modal from "../common/Modal";
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
    const shareUrl = "www.fotxtailapp.com";
    const title = "Foxtail - Free dating for alternative relationships";
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
                    <FacebookShareButton url={shareUrl} quote={title}>
                      <span aria-label="facebook share">
                        <i />
                      </span>
                    </FacebookShareButton>
                  </li>
                  <li className="twitter">
                    <TwitterShareButton url={shareUrl} title={title}>
                      <span aria-label="twitter share">
                        <i />
                      </span>
                    </TwitterShareButton>
                  </li>
                  <li className="mail">
                    <EmailShareButton url={shareUrl} subject={title}>
                      <span aria-label="email share">
                        <i />
                      </span>
                    </EmailShareButton>
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
                © 2019 - 2020 Foxtail App Inc. {t("register")}.
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
        {showRulesModal && (
          <Modal
            header={t("Quick Rules Review")}
            close={() => this.toggleRuleModal()}
            className="rules"
            okSpan={
              <span className="color" onClick={() => this.toggleRuleModal()}>
                {t("I understand")}
              </span>
            }
          >
            <div className="rulesCon">
              <p>{t("weexpect")} </p>
              <div>
                <h2>{t("lgRules")}:</h2>
                <ul>
                  <li>
                    {" "}
                    {t("Will get you banned and reported to law enforcement")}:
                    <ul>
                      <li>
                        {t("Sex for hire activity (including companionship)")}
                      </li>
                      <li>{t("Anything involving sexual acts with minors")}</li>
                      <li>
                        {t(
                          "Anything that is illegal in your juristdion. It is your responsioility to abide by your local laws."
                        )}
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul>
                  <li>
                    {t(
                      "Will get your account flagged. *Flags make your profile show lower in results. Once you get 3 flags, your account is suspended."
                    )}
                    <ul>
                      {" "}
                      <li>
                        {t(
                          "Harassing members (including rude remarks, stalking, shaming, insulting, accusing, and more...)"
                        )}
                      </li>
                      <li>
                        {t(
                          "Using automated means (bots) to manipulate or store information on Foxtail"
                        )}
                      </li>
                      <li>
                        {t(
                          "Taking any data from Foxtail and sharing or storing elsewhere"
                        )}
                      </li>
                      <li>{t("Spamming and promtion")}</li>
                    </ul>
                  </li>
                </ul>
                <div className="btm-msg">
                  {t("Please follow all of our rules.")}
                  <span className="saying">{t("Stay Sexy, Stay Safe")}</span>
                </div>
                <div className="btm-sitename">Foxtail.</div>
              </div>
            </div>
          </Modal>
        )}
        {showContactModal && (
          <ContactUsModal
            close={() => this.toggleContactModal()}
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
