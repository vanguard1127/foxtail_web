import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";
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
              <NavLink to="/inbox">{t("common:Inbox")}</NavLink>
            </span>
            <span className="title">
              {t("subtitle")}{" "}
              <span onClick={toggleRuleModal} className="link">
                {t("rules")}
              </span>
              .{" "}
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default InboxHeader;
