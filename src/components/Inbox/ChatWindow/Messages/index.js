import React, { Component } from "react";
import { Waypoint } from "react-waypoint";
import Message from "./Message.js";
import _ from "lodash";
import DateItem from "./DateItem";

class MessageList extends Component {
  isUserInside = true;
  constructor(props) {
    super(props);
    this.messagesEnd = React.createRef();
  }
  state = {
    hasMoreItems:
      this.props.messages.length < process.env.REACT_APP_CHATMSGS_LIMIT
        ? false
        : true,
    previousClientHeight: null,
    previousScrollHeight: null,
    previousScrollTop: 0,
    dateWaypoints: [],
    fetching: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.messages.length !== nextProps.messages.length ||
      this.state.hasMoreItems !== nextState.hasMoreItems ||
      this.state.previousClientHeight !== nextState.previousClientHeight ||
      this.state.previousScrollHeight !== nextState.previousScrollHeight ||
      this.state.previousScrollTop !== nextState.previousScrollTop ||
      this.state.dateWaypoints.length !== nextState.dateWaypoints.length ||
      this.props.chatID !== nextProps.chatID
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.scrollToBottom();
    this.props.subscribeToMore();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.isUserInside && this.scrollToBottom();
    }
  }

  handleEndScrollUp = ({ cursor }) => {
    const { fetching, hasMoreItems } = this.state;
    if (!hasMoreItems || fetching) return;

    this.fetchDataForScrollUp(cursor);
  };

  fetchDataForScrollUp = async cursor => {
    this.props.ErrorHandler.setBreadcrumb("fetch more messages");
    const { chatID, limit, fetchMore } = this.props;

    this.setState(
      {
        fetching: true
      },
      () => {
        fetchMore({
          variables: {
            chatID,
            limit,
            cursor
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (fetchMoreResult.getMessages.messages.length < 12) {
              this.setState({
                hasMoreItems: false
              });
            }
            if (
              fetchMoreResult.getMessages.messages.length === 0 ||
              !fetchMoreResult
            ) {
              return prev;
            }

            let previousResult = Array.from(prev.getMessages.messages);

            if (previousResult) {
              previousResult = [
                ...previousResult,
                ...fetchMoreResult.getMessages.messages
              ];
            }
            this.setState({
              fetching: false
            });
            return {
              getMessages: {
                messages: [...previousResult],
                __typename: "ChatType"
              }
            };
          }
        });
      }
    );
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
    const { currentUserID, t, dayjs, lang, messages } = this.props;
    const { fetching, hasMoreItems } = this.state;
    // console.log(messages);
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
    //  console.log("Final", messageElements);
    return (
      <div>
        {hasMoreItems && (
          <div
            style={{
              textAlign: "center",
              textDecoration: "underline",
              color: "blue",
              cursor: "pointer",
              padding: "10px"
            }}
            onClick={() =>
              this.handleEndScrollUp({
                cursor: messages[messages.length - 1].createdAt
              })
            }
          >
            {fetching ? "Loading..." : "Click for more"}
          </div>
        )}
        {/* <Waypoint
          onEnter={({ previousPosition }) => {
            if (messages.length > 0) {
              this.handleEndScrollUp({
                previousPosition,
                cursor: messages[messages.length - 1].createdAt
              });
            }
          }}
          topOffset="-20%"
          key="top"
          fireOnRapidScroll={true}
          ref={node => {
            this.topWaypoint = node;
          }}
        /> */}
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
          {messageElements}{" "}
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
                    this.isUserInside = true;
                  } else {
                    this.isUserInside = false;
                  }
                }
              }}
            />
          </div>
          <div
            style={{
              float: "left",
              clear: "both"
            }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </div>
      </div>
    );
  }
}
export default MessageList;
