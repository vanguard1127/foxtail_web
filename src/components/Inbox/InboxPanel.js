import React from "react";
import InboxSearchTextBox from "./InboxSearchTextBox";
import { GET_INBOX, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "../common/Spinner";
import InboxList from "./InboxList";

const InboxPanel = ({ readChat, currentUserID }) => {
  let unsubscribe = null;
  return (
    <Query query={GET_INBOX} fetchPolicy="cache-first">
      {({ data, loading, error, subscribeToMore }) => {
        if (loading) {
          return <Spinner message="Loading..." size="large" />;
        }
        if (!data.getInbox) {
          return <div>No messages</div>;
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
                if (
                  prev.getInbox.findIndex(
                    el => el.chatID === newInboxMsgSubscribe.chatID
                  ) > -1
                ) {
                  prev.getInbox[
                    prev.getInbox.findIndex(
                      el => el.chatID === newInboxMsgSubscribe.chatID
                    )
                  ] = newInboxMsgSubscribe;
                } else {
                  prev.getInbox = [newInboxMsgSubscribe, ...prev.getInbox];
                }
              }
              return prev;
            }
          });
        }

        const messages = data.getInbox;
        if (!messages || messages.length === 0) {
          return <div>No Messages Available</div>;
        }

        return (
          <div className="col-md-4 col-lg-3 col-xl-3">
            <div className="left">
              <InboxSearchTextBox />
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
