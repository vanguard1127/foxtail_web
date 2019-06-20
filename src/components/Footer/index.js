import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";
import Modal from "../common/Modal";
import Rules from "../Information/Rules";
import ContactUsModal from "../Modals/ContactUs";
import { SEEN_TOUR } from "../../queries";

import { withTranslation } from "react-i18next";

class Footer extends Component {
  state = { showRulesModal: false, showContactModal: false };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showRulesModal !== nextState.showRulesModal ||
      this.state.showContactModal !== nextState.showContactModal
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
    const { t } = this.props;
    const { showRulesModal, showContactModal } = this.state;
    const shareUrl = "www.fotxtailapp.com";
    const title = "Foxtail";
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
                    <EmailShareButton url={shareUrl} title={title}>
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
                    <span onClick={this.toggleRuleModal}>Rules</span>
                  </li>
                  {process.env.NODE_ENV === "development" && (
                    <li>
                      <Mutation
                        mutation={SEEN_TOUR}
                        variables={{
                          tour: "reset"
                        }}
                      >
                        {seenTour => {
                          //TODO:REmove
                          return (
                            <span onClick={() => seenTour()}>Reset Tour</span>
                          );
                        }}
                      </Mutation>
                    </li>
                  )}
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
            header={"Quick Rules Review"}
            close={() => this.toggleRuleModal()}
            okSpan={
              <span className="color" onClick={() => this.toggleRuleModal()}>
                I understand
              </span>
            }
          >
            <div>
              <p>
                We expect everyone to read our Terms & Conditions. But for those
                who need a quick list of rules, we have a list here. THESE ARE
                NOT ALL OF THE RULES, but some of the most important. Failure to
                follow these rules could result in your account: being suspended
                to being reported to law enforcement.
                <br />
                Rules:
              </p>
              <p>
                Will get you banned and reported to law enforcement:
                <ul>
                  <li>Sex for hire activity (including companionship)</li>
                  <li>
                    Anything involving minors (including talking Rules them)
                  </li>
                  <li>
                    Anything that is illegal in your juristdion. It is your
                    responsioility to abide by your local laws
                  </li>
                </ul>
                Will get your account flagged. *Flags make your profile show
                lower in results. Once you get 3 flags, your acount is
                suspended.
                <ul>
                  <li>
                    Harassing members (including rude remarks, stalking,
                    shaming, insulting, accusing, and more...){" "}
                  </li>
                  <li>
                    Using automated means (bots) to manipulate or store
                    information on Foxtail
                  </li>
                  <li>
                    Taking any data from Foxtail and sharing or storing
                    elsewhere
                  </li>
                  <li>Spamming and promtion</li>
                </ul>
                Please follow all of our rules for a better experience for all.
                <br />
                At Foxtail we're all about, Sexy safe fun!
              </p>
            </div>
          </Modal>
        )}
        {showContactModal && (
          <ContactUsModal
            close={() => this.toggleContactModal()}
            header="Send us a Message"
            description="Questions/Comments/Suggestions/etc..."
            okText={t("common:Send")}
          />
        )}
      </footer>
    );
  }
}

export default withTranslation("footer")(Footer);
