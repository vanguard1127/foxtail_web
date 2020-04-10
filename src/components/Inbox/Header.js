import React, { PureComponent } from "react";
import "../../assets/css/breadcrumb.css";
class InboxHeader extends PureComponent {
  render() {
    const { t, chatOpen, closeChat, toggleRuleModal } = this.props;

    return (
      <section className="breadcrumb">
        <div className="container">
          <div className="col-md-12">
            <span
              className={chatOpen ? "head back" : "head"}
              onClick={closeChat}
            >
              {t("common:Inbox")}
            </span>
            <span className="title">
              {t("subtitle")}{" "}
              <span onClick={toggleRuleModal} className="link">
                {t("rules")}
              </span>
              .
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default InboxHeader;
