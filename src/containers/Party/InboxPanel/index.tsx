import React, { useRef, useState, memo, useEffect } from "react";
import { useQuery } from "react-apollo";
import produce from "immer";
import { WithT } from "i18next";

import Spinner from "components/common/Spinner";
import { GET_INBOX, NEW_INBOX_SUB, MESSAGE_ACTION_SUB } from "queries";
import * as ErrorHandler from "components/common/ErrorHandler";

import InboxList from "./InboxList";
import { IUser } from "types/user";

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || "12");

interface IInboxPanelProps extends WithT {
  currentuser: IUser;
  openChat: (chatID: any) => void;
}

const InboxPanel: React.FC<IInboxPanelProps> = memo(
  ({ currentuser, openChat, t }) => {
    const unsubscribe = useRef(null);
    const unsubscribe2 = useRef(null);
    const [state, setState] = useState({
      searchTerm: "",
      skip: 0,
      hasMore: true
    });

    const {
      data,
      loading,
      error,
      subscribeToMore,
      fetchMore,
      refetch
    } = useQuery(GET_INBOX, {
      variables: {
        skip: state.skip,
        limit,
        isMobile: sessionStorage.getItem("isMobile")
      },
      fetchPolicy: "cache-first"
    });

    useEffect(() => {
      return () => {
        if (unsubscribe) {
          unsubscribe.current();
        }
        if (unsubscribe2) {
          unsubscribe2.current();
        }
      };
    }, []);

    const fetchData = (fetchMore) => {
      const { skip, hasMore } = state;
      if (!hasMore) {
        return;
      }

      setState({ ...state, skip: skip + limit });
      fetchMore({
        variables: { skip: skip + limit, limit: limit },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            !fetchMoreResult.getInbox ||
            fetchMoreResult.getInbox.length === 0
          ) {
            setState({ ...state, hasMore: false });
            return previousResult;
          }

          if (!previousResult) {
            return { getInbox: [] };
          }

          const newInbox = produce(previousResult, (draftState) => {
            draftState.getInbox = [
              ...previousResult.getInbox,
              ...fetchMoreResult.getInbox
            ];
          });

          return newInbox;
        }
      });
    };

    if (!unsubscribe.current) {
      unsubscribe.current = subscribeToMore({
        document: NEW_INBOX_SUB,
        variables: {
          isMobile: sessionStorage.getItem("isMobile")
        },
        updateQuery: (prev, { subscriptionData }) => {
          const { newInboxMsgSubscribe } = subscriptionData.data;
          if (!newInboxMsgSubscribe) {
            return prev;
          }
          if (!prev) {
            prev = [];
          }
          const previousResult = produce(prev.getInbox, (draftState) => {
            if (draftState) {
              const chatIndex = draftState.findIndex(
                (el) => el.chatID === newInboxMsgSubscribe.chatID
              );

              if (chatIndex > -1) {
                if (
                  sessionStorage.getItem("page") === "inbox" &&
                  sessionStorage.getItem("pid") === newInboxMsgSubscribe.chatID
                ) {
                  newInboxMsgSubscribe.unSeenCount = 0;
                } else {
                  newInboxMsgSubscribe.unSeenCount =
                    draftState[chatIndex].unSeenCount + 1;
                }
                draftState[chatIndex] = newInboxMsgSubscribe;
              } else {
                draftState = [newInboxMsgSubscribe, ...draftState];
              }
            }
          });
          return { getInbox: [...previousResult] };
        }
      });
    }

    if (error) {
      return (
        <ErrorHandler.report
          error={error}
          calledName={"getInbox"}
          userID={currentuser.userID}
        />
      );
    }

    return (
      <div className="col-md-4 col-lg-3 col-xl-3">
        <div className="left">
          <InboxList
            fetchData={() => fetchData(fetchMore)}
            openChat={openChat}
            currentuser={currentuser}
            t={t}
          />
        </div>
      </div>
    );
  }
);

export default InboxPanel;
