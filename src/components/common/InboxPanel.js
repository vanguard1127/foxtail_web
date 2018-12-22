import React, { Component, Fragment } from "react";
import { Input } from "antd";
import { GET_INBOX, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "./Spinner";
import InboxList from "./InboxList";

class InboxPanel extends Component {
  //Variables by text
  render() {
    const { setChatID, currentUserID } = this.props;
    let unsubscribe = null;
    return (
      <Fragment>
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
                  } else {
                    console.error("ERROR OCCURED");
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
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "horizontal",
                  backgroundColor: "red"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "lightblue",
                    padding: "10px"
                  }}
                >
                  <div>
                    <Input placeholder={"Search name"} />
                  </div>
                  <InboxList
                    messages={messages}
                    setChatID={setChatID}
                    currentUserID={currentUserID}
                  />
                </div>
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default InboxPanel;
