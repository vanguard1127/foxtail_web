import React, { Component } from "react";
import { Waypoint } from "react-waypoint";
import Message from "./Message.js";
import { NEW_MESSAGE_SUB } from "../../../../queries";
import _ from "lodash";
import DateItem from "./DateItem";

class MessageList extends Component {
  unsubscribe;
  constructor(props) {
    super(props);
    this.messagesEnd = React.createRef();
  }
  state = {
    restoreScroll: false,
    hasMoreItems: true,
    previousClientHeight: null,
    previousScrollHeight: null,
    previousScrollTop: 0,
    dateWaypoints: [],
    messages: this.props.messages
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.messages.length !== nextState.messages.length ||
      this.state.restoreScroll !== nextState.restoreScroll ||
      this.state.hasMoreItems !== nextState.hasMoreItems ||
      this.state.previousClientHeight !== nextState.previousClientHeight ||
      this.state.previousScrollHeight !== nextState.previousScrollHeight ||
      this.state.previousScrollTop !== nextState.previousScrollTop ||
      this.state.dateWaypoints.length !== nextState.dateWaypoints.length ||
      this.props.chatID !== nextProps.chatID ||
      this.props.messages !== nextProps.messages
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.scrollToBottom();
    if (this.props.subscribeToMore) {
      this.subscribeToMessages();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      if (this.isUserInside) {
        this.scrollToBottom();
      }
    }
  }

  handleEndScrollUp = ({ previousPosition, currentPosition, cursor }) => {
    if (this.state.hasMoreItems) {
      if (previousPosition === Waypoint.above) {
        this.fetchDataForScrollUp(cursor);
      }
    }
  };

  fetchDataForScrollUp = async cursor => {
    this.props.ErrorHandler.setBreadcrumb("fetch more messages");
    const { chatID, limit, fetchMore } = this.props;
    if (!this.state.hasMoreItems || this.state.restoreScroll) return;
    if (this.mounted) {
      fetchMore({
        variables: {
          chatID,
          limit,
          cursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            fetchMoreResult.getMessages.messages.length < limit
          ) {
            this.setState({ hasMoreItems: false });
          }

          if (previousResult.getMessages) {
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];
          } else {
            previousResult.getMessages = fetchMoreResult.getMessages;
          }

          this.setState({ messages: previousResult.getMessages.messages });
          return previousResult;
        }
      });
    }
  };

  subscribeToMessages = () => {
    const { chatID, subscribeToMore } = this.props;
    this.unsubscribe = subscribeToMore({
      document: NEW_MESSAGE_SUB,
      variables: {
        chatID: chatID
      },
      updateQuery: (prev, { subscriptionData }) => {
        const { newMessageSubscribe } = subscriptionData.data;

        if (!newMessageSubscribe) {
          return prev;
        }

        if (prev.getMessages) {
          prev.getMessages.messages = [
            newMessageSubscribe,
            ...prev.getMessages.messages
          ];
        } else {
          prev.getMessages = {
            messages: [newMessageSubscribe],
            __typename: "ChatType"
          };
        }
        if (this.mounted) {
          this.setState({ messages: prev.getMessages.messages });
        }

        return prev;
      }
    });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  onDateWaypointPostion = (i, position) => {
    if (this.state.dateWaypoints[i] === position) return;
    //
    // Perhaps find another way to tell the parent children position
    // parent needs children position to tell the alst above item to render as absolute
    const newDateWaypoints = this.state.dateWaypoints;
    newDateWaypoints[i] = position;
    if (this.mounted) {
      this.setState({
        dateWaypoints: newDateWaypoints
      });
    }
  };

  render() {
    const { children, currentUserID, t, dayjs, lang } = this.props;

    const { messages } = this.state;

    const messageElements = _.flatten(
      _.chain(messages)
        .groupBy(datum =>
          dayjs(datum.createdAt)
            .locale(lang)
            .format("dddd, MMMM D, YYYY")
            .toLocaleUpperCase()
        )
        .map((messages, date) => ({ date, messages })) //using ES6 shorthand to generate the objects
        .reverse() // Reverse so latest date is on the bottom
        .map((item, index) => {
          const messageElements = item.messages
            .map(message => {
              let props = {
                key: message.id,
                message,
                currentUserID,
                t
              };

              if (message.type === "alert") {
                return (
                  <div
                    style={{
                      margin: "0 -20px 0 -20px",
                      background: "#ffffff70",
                      padding: "20px 0",
                      textAlign: "center"
                    }}
                    key={message.id}
                  >
                    {message.text}
                  </div>
                );
              } else if (message.type === "left") {
                return (
                  <div
                    style={{
                      margin: "0 -20px 0 -20px",
                      background: "#ffffff70",
                      padding: "20px 0",
                      textAlign: "center"
                    }}
                    key={message.id}
                  >
                    {message.text + " " + t("leftchat")}
                  </div>
                );
              }
              return (
                <Message
                  key={message.id}
                  {...props}
                  dayjs={dayjs}
                  lang={lang}
                />
              );
            })
            .reverse();
          // At the start of every date group insert a date element.
          const dateElement = (
            <DateItem
              stickZIndex={index + 10}
              onAbove={() => {
                this.onDateWaypointPostion(index, "above");
              }}
              onInside={() => {
                this.onDateWaypointPostion(index, "inside");
              }}
              // Keys won't collied because DateItems's dates are days appart from each other
              key={`messageDate-${item.date}`}
              hasMoreItems={this.hasMoreItems}
            >
              {item.date}
            </DateItem>
          );
          return [dateElement].concat(messageElements);
        })
        .value()
    );

    return (
      <div>
        {/** Parent for abs position elements because scroll does weird things for abs items */}
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
          <div
            style={{
              position: "absolute",
              top: "30%"
            }}
          >
            <Waypoint
              onEnter={({ previousPosition, currentPosition }) => {
                if (messages.length > 0) {
                  this.handleEndScrollUp({
                    previousPosition,
                    currentPosition,
                    cursor: messages[messages.length - 1].createdAt
                  });
                }
              }}
            />
          </div>
          {messageElements}{" "}
          <div
            style={{
              position: "absolute",
              bottom: "20%"
            }}
          >
            <Waypoint
              onPositionChange={({ currentPosition }) => {
                if (messages.length > 0) {
                  if (currentPosition === Waypoint.inside) {
                    this.isUserInside = true;
                  } else {
                    this.isUserInside = false;
                  }
                }
              }}
            />
          </div>
          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
          {children}
        </div>
      </div>
    );
  }
}
export default MessageList;
