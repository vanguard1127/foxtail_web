import React, { Component } from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "../common/Spinner";
import InboxList from "./InboxList";
let unsubscribe = null;
class InboxPanel extends Component {
  //TODO: Test if this prevent new messages from getting shown
  shouldComponentUpdate(nextProps) {
    if (this.props.chatOpen !== nextProps.chatOpen) {
      return true;
    }
    return false;
  }
  render() {
    const { readChat, currentuser, t, ErrorHandler, chatOpen } = this.props;

    return (
      <Query query={GET_INBOX} fetchPolicy="cache-and-network">
        {({ data, loading, error, subscribeToMore }) => {
          if (loading) {
            return (
              <div className="col-md-4 col-lg-3 col-xl-3">
                <div className="left">
                  <InboxSearchTextBox t={t} />
                  <Spinner page="inbox" title={t("allmems")} />
                </div>
              </div>
            );
          }
          if (error) {
            return (
              <ErrorHandler.report error={error} calledName={"getSettings"} />
            );
          }

          const messages = data.getInbox;

          if (!messages) {
            return <div>{t("common:error")}.</div>;
          }

          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
              document: NEW_INBOX_SUB,
              updateQuery: (prev, { subscriptionData }) => {
                let { newInboxMsgSubscribe } = subscriptionData.data;
                if (!newInboxMsgSubscribe) {
                  return prev;
                }

                if (prev.getInbox) {
                  const chatIndex = prev.getInbox.findIndex(
                    el => el.chatID === newInboxMsgSubscribe.chatID
                  );

                  if (
                    sessionStorage.getItem("page") === "inbox" &&
                    sessionStorage.getItem("pid") ===
                      newInboxMsgSubscribe.chatID
                  ) {
                    newInboxMsgSubscribe.unSeenCount = 0;
                  }

                  if (chatIndex > -1) {
                    prev.getInbox[chatIndex] = newInboxMsgSubscribe;
                  } else {
                    prev.getInbox = [newInboxMsgSubscribe, ...prev.getInbox];
                  }
                }
                return prev;
              }
            });
          }

          return (
            <div className="col-md-4 col-lg-3 col-xl-3">
              <div className={chatOpen ? "left hide" : "left"}>
                <InboxSearchTextBox t={t} />
                <InboxList
                  messages={messages}
                  readChat={readChat}
                  currentuser={currentuser}
                />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default InboxPanel;
