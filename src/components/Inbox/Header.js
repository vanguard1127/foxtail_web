import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";
class InboxHeader extends PureComponent {
  render() {
    const { t, chatOpen, closeChat } = this.props;

    return (
      <section className="breadcrumb">
        <div className="container">
          <div className="col-md-12">
            <span
              className={chatOpen ? "head back" : "head"}
              onClick={() => closeChat()}
            >
              <NavLink to="/inbox">{t("common:Inbox")}</NavLink>
            </span>
            <span className="title">
              {t("subtitle")} <NavLink to="/inbox">{t("rules")}</NavLink>.{" "}
            </span>
          </div>
        </div>
      </section>
    );
  }
}

export default InboxHeader;
