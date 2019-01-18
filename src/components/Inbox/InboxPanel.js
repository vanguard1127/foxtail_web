import React from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import { InboxLoader } from "../common/Skeletons";
import InboxList from "./InboxList";
let unsubscribe = null;
const InboxPanel = ({ readChat, currentUserID, t }) => {
  return (
    <Query query={GET_INBOX} fetchPolicy="cache-and-network">
      {({ data, loading, error, subscribeToMore }) => {
        if (loading) {
          return (
            <div className="col-md-4 col-lg-3 col-xl-3">
              <div className="left">
                <InboxSearchTextBox t={t} />
                <div className="conversations">
                  <div className="item unread" key={"1"}>
                    <InboxLoader />
                  </div>
                  <div className="item unread" key={"2"}>
                    <InboxLoader />
                  </div>
                </div>
              </div>
            </div>
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
                  sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
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
            <div className="left">
              <InboxSearchTextBox t={t} />
              <InboxList
                messages={messages}
                readChat={readChat}
                currentUserID={currentUserID}
              />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default InboxPanel;
