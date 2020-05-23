import React, { useRef, useState, memo, useEffect } from "react";
import { useQuery } from "react-apollo";
import produce from "immer";
import { WithT } from "i18next";

import Spinner from "components/common/Spinner";
import {
  GET_INBOX,
  NEW_INBOX_SUB,
  MESSAGE_ACTION_SUB
} from "queries";
import * as ErrorHandler from 'components/common/ErrorHandler';

import InboxSearchTextBox from "./InboxSearchTextBox";
import InboxList from "./InboxList";
import { IUser } from "types/user";

const limit = parseInt(process.env.REACT_APP_INBOXLIST_LIMIT || '12');

interface IInboxPanelProps extends WithT {
  currentuser: IUser;
  openChat: (chatID: any) => void;
  chatID: string | null;
  updateCount: (unSeenCount: any) => void;
}

const InboxPanel: React.FC<IInboxPanelProps> = memo(({
  currentuser,
  openChat,
  chatID,
  updateCount,
  t,
}) => {
  const unsubscribe = useRef(() => { });
  const unsubscribe2 = useRef(() => { });
  const [state, setState] = useState({
    searchTerm: "",
    skip: 0,
    hasMore: true
  });

  const { data, loading, error, subscribeToMore, fetchMore, refetch } = useQuery(GET_INBOX, {
    variables: {
      skip: state.skip,
      limit,
      isMobile: sessionStorage.getItem("isMobile")
    },
    fetchPolicy: "cache-first"
  })

  useEffect(() => {
    return () => {
      unsubscribe.current();
      unsubscribe2.current();
    }
  }, []);

  const handleSearchTextChange = (refetch, e) => {
    setState({ skip: 0, searchTerm: e.target.value, hasMore: true });
    if (e.target.value === "") {
      refetch();
    }
  };

  const fetchData = fetchMore => {
    const { skip, hasMore } = state;
    if (!hasMore) {
      return;
    }

    setState({ ...state, skip: skip + limit })
    fetchMore({
      variables: { skip: skip + limit, limit: limit },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.getInbox ||
          fetchMoreResult.getInbox.length === 0) {
          setState({ ...state, hasMore: false });
          return previousResult;
        }

        if (!previousResult) {
          return { getInbox: [] };
        }

        const newInbox = produce(previousResult, draftState => {
          draftState.getInbox = [
            ...previousResult.getInbox,
            ...fetchMoreResult.getInbox
          ];
        });

        return newInbox;
      }
    })
  };

  const { searchTerm } = state;
  if (loading) {
    return (
      <div className="col-md-4 col-lg-3 col-xl-3">
        <div className="left">
          <InboxSearchTextBox t={t} handleSearchTextChange={null} />
          <Spinner page="inbox" title={t("allmems")} />
        </div>
      </div>
    );
  }

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
      const previousResult = produce(prev.getInbox, draftState => {
        if (draftState) {
          const chatIndex = draftState.findIndex(
            el => el.chatID === newInboxMsgSubscribe.chatID
          );

          if (chatIndex > -1) {
            if (
              sessionStorage.getItem("page") === "inbox" &&
              sessionStorage.getItem("pid") ===
              newInboxMsgSubscribe.chatID
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

  unsubscribe2.current = subscribeToMore({
    document: MESSAGE_ACTION_SUB,
    updateQuery: (prev, { subscriptionData }) => {
      const { messageActionSubsubscribe } = subscriptionData.data;
      if (!messageActionSubsubscribe) {
        return prev;
      }
      if (!prev) {
        prev = [];
      }
      const newData = produce(prev.getInbox, draftState => {
        const chatIndex = draftState.findIndex(
          el => el.chatID === messageActionSubsubscribe.chatID
        );

        if (!messageActionSubsubscribe.seenBy && chatIndex > -1) {
          if (messageActionSubsubscribe.isTyping) {
            if (!draftState[chatIndex].typingList) {
              draftState[chatIndex].typingList = [
                messageActionSubsubscribe.name
              ];
            } else {
              draftState[chatIndex].typingList.push(
                messageActionSubsubscribe.name
              );
            }
          } else if (draftState[chatIndex].typingList) {
            draftState[chatIndex].typingList = draftState[
              chatIndex
            ].typingList.filter(function (elem, i, rep) {
              return (
                i !== rep.indexOf(messageActionSubsubscribe.name)
              );
            });
          }
          if (draftState[chatIndex].typingList) {
            switch (draftState[chatIndex].typingList.length) {
              case 0:
                draftState[chatIndex].typingText = null;
                break;
              case 1:
                draftState[chatIndex].typingText =
                  draftState[chatIndex].typingList[0] +
                  " is typing...";
                break;
              default:
                draftState[chatIndex].typingText =
                  "Members are typing...";
                break;
            }
          }
        }
      });
      return { getInbox: [...newData] };
    }
  });

  const messages = data.getInbox || [];

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
        <InboxSearchTextBox
          handleSearchTextChange={e =>
            handleSearchTextChange(refetch, e)
          }
          t={t}
        />
        <InboxList
          messages={messages}
          fetchData={() => fetchData(fetchMore)}
          openChat={openChat}
          currentuser={currentuser}
          searchTerm={searchTerm}
          updateCount={updateCount}
          chatID={chatID}
          t={t}
        />
      </div>
    </div>
  );
});

export default InboxPanel;
