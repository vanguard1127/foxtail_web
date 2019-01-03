import React from "react";
import { NavLink } from "react-router-dom";
import { GET_COUNTS, NEW_NOTICE_SUB, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import Signout from "../Auth/Signout";
import NoticesDropdown from "../common/NoticesDropdown";
import InboxItem from "./InboxItem";
import MyAccountItem from "./MyAccountItem";
var slapAudio = new Audio(require("../../docs/slap.wav"));

let unsubscribe = null;
const UserToolbar = ({ currentuser }) => {
  return (
    <Query query={GET_COUNTS} fetchPolicy="cache-and-network">
      {({ data, loading, error, subscribeToMore }) => {
        if (loading) {
          return (
            <div className="function">
              {/* TODO:Delete this */}

              <Signout />
              <InboxItem />
              <div className="notification active">
                <span className="icon alert" />
              </div>
              <div className="user hidden-mobile">
                <MyAccountItem />
              </div>
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

                if (newInboxMsgSubscribe.fromUser.id === currentuser.userID) {
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
            {/* TODO:Delete this */}

            <Signout />
            <InboxItem count={msgsCount} />
            <div className="notification active">
              <span className="icon alert">
                <span className="count">{noticesCount}</span>
              </span>
            </div>
            <div className="user hidden-mobile">
              <MyAccountItem />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default UserToolbar;
