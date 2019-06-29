import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class InboxItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.count !== nextProps.count ||
      this.props.active !== nextProps.active ||
      this.props.t !== nextProps.t
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
      <NavLink to="/inbox">
        <div className={iconstyle} role="heading" aria-level="1">
          <span className="icon mail">
            <span className="count">{count}</span>
          </span>
          <span className="text">{t("common:Inbox")}</span>
        </div>{" "}
      </NavLink>
    );
  }
}

export default InboxItem;
