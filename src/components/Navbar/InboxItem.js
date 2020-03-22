import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import deleteFromCache from "../../utils/deleteFromCache";
import { withApollo } from "react-apollo";
import { GET_COUNTS } from "../../queries";
class InboxItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.count !== nextProps.count ||
      this.props.blinkInbox !== nextProps.blinkInbox ||
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
    const { t, count, blinkInbox } = this.props;
    let iconstyle = "inbox hidden-mobile";
    if (count > 0) {
      iconstyle += " new";
    }

    return (
      <NavLink
        to="/inbox"
        onClick={() => {
          const { cache } = this.props.client;

          if (window.location.pathname !== "/inbox") {
            deleteFromCache({ cache, query: "getInbox" });
            const { getCounts } = cache.readQuery({
              query: GET_COUNTS
            });

            let newCounts = { ...getCounts };

            newCounts.newMsg = false;

            cache.writeQuery({
              query: GET_COUNTS,
              data: {
                getCounts: { ...newCounts }
              }
            });
          } else {
            //TODO: fix when you can rerender inbox
            window.location.reload(false);
          }
        }}
      >
        <div className={iconstyle} role="heading" aria-level="1">
          <span className={blinkInbox ? "icon mail blink" : "icon mail"}>
            <span className="count">{count}</span>
          </span>
          <span className="text">{t("common:Inbox")}</span>
        </div>
      </NavLink>
    );
  }
}

export default withApollo(InboxItem);
