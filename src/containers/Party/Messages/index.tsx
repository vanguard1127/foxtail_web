import React, { memo, useRef, useState, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import dayjs from 'dayjs';
import { WithT } from "i18next";

import * as ErrorHandler from 'components/common/ErrorHandler';

import Message from "./Message";
import DateItem from "./DateItem";
import ClickForMoreBtn from "./ClickForMoreBtn";
import AlertMessage from "./AlertMessage";

interface IMessagesProps extends WithT {
  messages: any;
  currentUserID: string;
  subscribeToMore: any;
  chatID: string;
  limit: number;
  fetchMore: any;
  lang: string;
  typingText: any;
  handlePreview?: (e: any) => void;
}

const Messages: React.FC<IMessagesProps> = memo(({
  messages,
  currentUserID,
  subscribeToMore,
  chatID,
  limit,
  fetchMore,
  lang,
  typingText,
  handlePreview,
  t,
}) => {
  const isUserInside = useRef(true);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    hasMoreItems: messages.length > process.env.REACT_APP_CHATMSGS_LIMIT,
    previousClientHeight: null,
    previousScrollHeight: null,
    previousScrollTop: 0,
    dateWaypoints: [],
    fetching: false
  })

  useEffect(() => {
    scrollToBottom();
    subscribeToMore();
  }, []);

  useEffect(() => {
    if (isUserInside.current) {
      scrollToBottom()
    }
  }, [messages]);

  const handleEndScrollUp = ({ cursor }) => {
    const { fetching, hasMoreItems } = state;
    if (!hasMoreItems || fetching) {
      return;
    }
    fetchDataForScrollUp(cursor);
  };

  const fetchDataForScrollUp = cursor => {
    console.log('fetching more')
    ErrorHandler.setBreadcrumb("fetch more messages");
    setState({ ...state, fetching: true });
    fetchMore({
      variables: {
        chatID,
        limit,
        cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log('UpdateQuery');
        if (
          !fetchMoreResult ||
          fetchMoreResult.getMessages.messages.length === 0
        ) {
          setState({ ...state, hasMoreItems: false, fetching: false });
          return prev;
        }
        if (fetchMoreResult.getMessages.messages.length < 12) {
          setState({ ...state, hasMoreItems: false });
        }
        let previousResult = Array.from(prev.getMessages.messages);

        if (previousResult) {
          previousResult = [
            ...previousResult,
            ...fetchMoreResult.getMessages.messages
          ];
        }
        console.log('setting fetch false')
        setState({ ...state, fetching: false });
        return {
          getMessages: {
            messages: [...previousResult],
            __typename: "ChatType"
          }
        };
      },
    });
  };

  const scrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onDateWaypointPostion = (i, position) => {
    if (state.dateWaypoints[i] === position) return;
    //
    // Perhaps find another way to tell the parent children position
    // parent needs children position to tell the alst above item to render as absolute
    let newDateWaypoints = [...state.dateWaypoints];
    newDateWaypoints[i] = position;
    setState({ ...state, dateWaypoints: newDateWaypoints })
  };

  const groupBy = function (arr, criteria) {
    return arr.reduce(function (obj, item) {
      // Check if the criteria is a function to run on the item or a property of it
      var key =
        typeof criteria === "function" ? criteria(item) : item[criteria];

      // If the key doesn't exist yet, create it
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = [];
      }

      // Push the value to the object
      obj[key].push(item);

      // Return the object to the next item in the loop
      return obj;
    }, {});
  };

  const objectMap = object => {
    return Object.keys(object).reduce(function (result, key) {
      result.push({ date: key, messages: object[key] });
      return result;
    }, []);
  };

  const { fetching, hasMoreItems } = state;
  const group = groupBy(messages, datum =>
    dayjs(datum.createdAt)
      .locale(lang)
      .format("dddd, MMMM D, YYYY")
      .toLocaleUpperCase()
  );
  const messageElements = objectMap(group)
    .reverse()
    .map((item, index) => {
      const messageElements = item.messages
        .map(message => {
          switch (message.type) {
            case 'alert':
              return <AlertMessage key={message.id} text={message.text} />;
            case 'left':
              return <AlertMessage
                key={message.id}
                text={`${message.text} ${t("leftchat")}`}
              />
            default:
              return (
                <Message
                  key={message.id}
                  message={message}
                  currentUserID={currentUserID}
                  lang={lang}
                  handlePreview={handlePreview}
                  t={t}
                />
              );
          }
        })
        .reverse();
      // At the start of every date group insert a date element.
      const dateElement = (
        <DateItem
          key={`messageDate-${item.date}`}
          stickZIndex={index + 10}
          onAbove={() => {
            onDateWaypointPostion(index, "above");
          }}
          onInside={() => {
            onDateWaypointPostion(index, "inside");
          }}
          // Keys won't collied because DateItems's dates are days appart from each other
          hasMoreItems={hasMoreItems}
        >
          {item.date}
        </DateItem>
      );
      return [dateElement].concat(messageElements);
    })
    .reduce((a, b) => a.concat(b), []);

  return (
    <div>
      {hasMoreItems && (
        <ClickForMoreBtn
          onClick={() => {
            handleEndScrollUp({
              cursor: messages[messages.length - 1].createdAt
            })
          }}
          isLoading={fetching}
        />
      )}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {messageElements}
        <div
          style={{
            position: "absolute",
            bottom: "20%"
          }}
        >
          <Waypoint
            key="bottom"
            onPositionChange={({ currentPosition }) => {
              if (messages.length > 0) {
                if (currentPosition === Waypoint.inside) {
                  isUserInside.current = true;
                } else {
                  isUserInside.current = false;
                }
              }
            }}
          />
        </div>
        <div
          style={{
            float: "left",
            clear: "both",
            fontSize: "14px",
            color: "#9d9d9d"
          }}
          ref={messagesEnd}
        >
          {typingText}
        </div>
      </div>
    </div>
  );
});

export default Messages;
