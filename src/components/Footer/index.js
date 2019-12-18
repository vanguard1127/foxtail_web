import React, { Component } from "react";
import RulesModal from "../Modals/Rules";
import ContactUsModal from "../Modals/ContactUs";
import FooterLinks from "./FooterLinks";
import { withTranslation } from "react-i18next";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { showRulesModal: false, showContactModal: false };
    this.toggleContactModal = this.toggleContactModal.bind(this);
    this.toggleRuleModal = this.toggleRuleModal.bind(this);
  }
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
            </div>
          </div>
        </div>
        <FooterLinks
          toggleContactModal={this.toggleContactModal}
          toggleRuleModal={this.toggleRuleModal}
          t={t}
        />
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
