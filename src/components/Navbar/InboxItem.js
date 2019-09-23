import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import deleteFromCache from "../../utils/deleteFromCache";
import { withApollo } from "react-apollo";
class InboxItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.count !== nextProps.count ||
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
    const { active, t, count } = this.props;

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
          const { cache } = this.props.client;
          deleteFromCache({ cache, query: "getInbox" });
        }}
      >
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

export default withApollo(InboxItem);
