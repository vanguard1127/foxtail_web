import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { NEW_INBOX_SUB } from "../../queries";
class InboxItem extends Component {
  unsubscribe = null;
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
    if (this.props.subscribeToMore) {
      this.subscribeToMsgs();
    }
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  subscribeToMsgs = () => {
    this.unsubscribe = this.props.subscribeToMore({
      document: NEW_INBOX_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        const { newInboxMsgSubscribe } = subscriptionData.data;

        if (
          newInboxMsgSubscribe === null ||
          (newInboxMsgSubscribe.fromUser &&
            newInboxMsgSubscribe.fromUser.id === this.props.userID &&
            newInboxMsgSubscribe.text !== "New Match!")
        ) {
          return;
        }
        //if chat itself is open dont add
        if (!newInboxMsgSubscribe) {
          return prev;
        }

        const newCount = { ...prev.getCounts };

        if (
          sessionStorage.getItem("page") === "inbox" &&
          sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
        ) {
          return;
        }
        if (this.mounted) {
          if (newInboxMsgSubscribe.fromUser.id !== this.props.userID) {
            this.props.msgAudio.play();
          }
          newCount.msgsCount += 1;
        }
        return { getCounts: newCount };
      }
    });
  };
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
