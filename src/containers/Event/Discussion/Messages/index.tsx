import React, { useState, useEffect, useRef } from "react";
import { Waypoint } from "react-waypoint";

import * as ErrorHandler from "components/common/ErrorHandler";
import { NEW_MESSAGE_SUB } from "queries";

import Message from "./Message";

interface IMessageListProps {
  history: any;
  dayjs: any;
  loading: boolean;
  t: any;
  lang: string;
  subscribeToMore: any;
  chatID: string;
  messages: any;
  limit: number;
  fetchMore: any;
}

const MessageList: React.FC<IMessageListProps> = ({
  subscribeToMore,
  chatID,
  history,
  dayjs,
  loading,
  t,
  lang,
  messages: currMessages,
  limit,
  fetchMore,
}) => {
  const unsubscribe = useRef(null);
  const [{ hasMoreItems, messages }, setState] = useState({
    hasMoreItems: true,
    messages: currMessages
  });

  useEffect(() => {
    subscribeToNewMsgs();
    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, []);

  const subscribeToNewMsgs = () => {
    unsubscribe.current = subscribeToMore({
      document: NEW_MESSAGE_SUB,
      variables: {
        chatID: chatID,
        isMobile: sessionStorage.getItem("isMobile"),
        maxW: window.outerWidth,
        maxH: window.outerHeight
      },
      updateQuery: (prev, { subscriptionData }) => {
        const { newMessageSubscribe } = subscriptionData.data;

        if (!newMessageSubscribe) {
          return prev;
        }
        const newComments = [newMessageSubscribe, ...messages];

        setState((prev) => ({ ...prev, messages: newComments }));

        return;
      }
    });
  };

  const handleEnd = ({ previousPosition, currentPosition, cursor }) => {
    if (hasMoreItems) {
      if (previousPosition === Waypoint.below) {
        fetchData(cursor);
      } else if (
        previousPosition === undefined &&
        currentPosition === Waypoint.inside
      ) {
        setState((prev) => ({ ...prev, hasMoreItems: false }));
      }
    }
  };

  const fetchData = async (cursor) => {
    ErrorHandler.setBreadcrumb("Fetch more comments");

    fetchMore({
      variables: {
        chatID,
        limit,
        cursor
      },
      updateQuery: (_, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getComments.messages.length < limit
        ) {
          setState((prev) => ({ ...prev, hasMoreItems: false }));
        }

        const newComments = [
          ...messages,
          ...fetchMoreResult.getComments.messages
        ];

        setState((prev) => ({ ...prev, messages: newComments }));

        return;
      }
    });
  };

  if (messages.length === 0) {
    return (
      <div className="item" style={{ textAlign: "center" }}>
        {t("nocomm")}
      </div>
    );
  }

  const messageElements = messages.map((message) => {
    if (message.type !== "alert") {
      return (
        <Message
          key={message.id}
          message={message}
          history={history}
          dayjs={dayjs}
          lang={lang}
        />
      );
    }
  });

  return (
    <div className="messages">
      {messageElements}
      <div
        className="item"
        style={{ padding: "0px", position: "absolute", bottom: "0%" }}
      >
        <Waypoint
          onEnter={({ previousPosition, currentPosition }) =>
            handleEnd({
              previousPosition,
              currentPosition,
              cursor: messages && messages[messages.length - 1].createdAt
            })
          }
        />
      </div>
      {loading && (
        <div className="item">
          <span> {t("common:Loading")}</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;
