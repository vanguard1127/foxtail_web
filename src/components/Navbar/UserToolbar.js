import React from "react";
import { NavLink } from "react-router-dom";
import { GET_COUNTS, NEW_NOTICE_SUB, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import NoticesItem from "./NoticesItem";
import InboxItem from "./InboxItem";
import MyAccountItem from "./MyAccountItem";
var slapAudio = new Audio(require("../../docs/slap.wav"));

let unsubscribe = null;
const UserToolbar = ({ currentuser, href, t }) => {
  return (
    <Query query={GET_COUNTS} fetchPolicy="cache-and-network">
      {({ data, loading, error, subscribeToMore }) => {
        if (loading) {
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
          console.error(error.message);
        }
        let { msgsCount, noticesCount } = data.getCounts;
        if (!unsubscribe) {
          unsubscribe = [
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
                  newInboxMsgSubscribe.fromUser.id === currentuser.userID
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
                  sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
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
            <InboxItem
              count={msgsCount}
              active={href === "inbox" && true}
              t={t}
            />
            <NoticesItem count={noticesCount} t={t} />

            <div className="user hidden-mobile">
              <MyAccountItem currentuser={currentuser} t={t} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default UserToolbar;