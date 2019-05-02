import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class InboxItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.count !== nextProps.count ||
      this.props.active !== nextProps.active
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { count, active, t } = this.props;
    let iconstyle = "inbox hidden-mobile";
    if (count > 0) {
      iconstyle += " new";
    }
    if (active) {
      iconstyle += " active";
    }

    return (
      <div className={iconstyle} role="heading" aria-level="1">
        <NavLink to="/inbox">
          <span className="icon mail">
            <span className="count">{count}</span>
          </span>
          <span className="text">{t("common:Inbox")}</span>
        </NavLink>
      </div>
    );
  }
}

export default InboxItem;
