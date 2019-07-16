import React, { Component } from "react";
import { GET_COUNTS, NEW_NOTICE_SUB, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import NoticesItem from "./NoticesItem";
import InboxItem from "./InboxItem";
import MyAccountItem from "./MyAccountItem";
import * as ErrorHandler from "../common/ErrorHandler";
var slapAudio = new Audio(require("../../docs/slap.wav"));

class UserToolbar extends Component {
  unsubscribe = null;
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.currentuser !== nextProps.currentuser ||
      this.props.href !== nextProps.href ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }
  render() {
    const { currentuser, href, t, setRef } = this.props;
    return (
      <Query query={GET_COUNTS} fetchPolicy="cache-first">
        {({ data, loading, error, refetch, subscribeToMore }) => {
          if (loading || !data) {
            return (
              <div className="function">
                <InboxItem t={t} />
                <div className="notification" />
                <div className="user hidden-mobile" />
                <MyAccountItem t={t} />
              </div>
            );
          }
          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getCounts"}
                userID={currentuser.userID}
              />
            );
          }
          let { msgsCount, noticesCount } = data.getCounts;

          if (!this.unsubscribe) {
            this.unsubscribe = [
              subscribeToMore({
                document: NEW_NOTICE_SUB,
                updateQuery: (prev, { subscriptionData }) => {
                  const { newNoticeSubscribe } = subscriptionData.data;
                  if (!newNoticeSubscribe) {
                    return prev;
                  }
                  slapAudio.play();

                  return (prev.getCounts.noticesCount += 1);
                }
              }),
              subscribeToMore({
                document: NEW_INBOX_SUB,
                updateQuery: (prev, { subscriptionData }) => {
                  const { newInboxMsgSubscribe } = subscriptionData.data;

                  if (
                    newInboxMsgSubscribe === null ||
                    (newInboxMsgSubscribe.fromUser &&
                      newInboxMsgSubscribe.fromUser.id === currentuser.userID)
                  ) {
                    return;
                  }

                  //if chat itself is open dont add
                  if (!newInboxMsgSubscribe) {
                    return prev;
                  }
                  slapAudio.play();

                  if (
                    sessionStorage.getItem("page") === "inbox" &&
                    sessionStorage.getItem("pid") ===
                      newInboxMsgSubscribe.chatID
                  ) {
                    return;
                  }

                  return (prev.getCounts.msgsCount += 1);
                }
              })
            ];
          }

          return (
            <div className="function">
              <ErrorHandler.ErrorBoundary>
                <InboxItem
                  count={msgsCount}
                  active={href === "inbox" && true}
                  t={t}
                  data-name="inbox"
                  ref={setRef}
                />
              </ErrorHandler.ErrorBoundary>
              <ErrorHandler.ErrorBoundary>
                <NoticesItem
                  count={noticesCount}
                  countRefetch={refetch}
                  ErrorHandler={ErrorHandler}
                  t={t}
                />
              </ErrorHandler.ErrorBoundary>
              <ErrorHandler.ErrorBoundary>
                <div className="user hidden-mobile">
                  <MyAccountItem currentuser={currentuser} setRef={setRef} />
                </div>
              </ErrorHandler.ErrorBoundary>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default UserToolbar;
