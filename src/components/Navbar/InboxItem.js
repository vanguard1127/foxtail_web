import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import deleteFromCache from "../../utils/deleteFromCache";
import { withApollo } from "react-apollo";
class InboxItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.count !== nextProps.count ||
      this.props.blinkInbox !== nextProps.blinkInbox ||
      this.props.active !== nextProps.active ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { active, t, count, blinkInbox, stopBlink } = this.props;

    let iconstyle = "inbox hidden-mobile";
    if (count > 0) {
      iconstyle += " new";
    }
    if (active) {
      iconstyle += " active";
    }

    return (
      <NavLink
        to="/inbox"
        onClick={() => {
          stopBlink();
          const { cache } = this.props.client;
          deleteFromCache({ cache, query: "getInbox" });
        }}
      >
        <div className={iconstyle} role="heading" aria-level="1">
          <span
            className={blinkInbox && !active ? "icon mail blink" : "icon mail"}
          >
            <span className="count">{count}</span>
          </span>
          <span className="text">{t("common:Inbox")}</span>
        </div>{" "}
      </NavLink>
    );
  }
}

export default withApollo(InboxItem);
