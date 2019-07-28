import React, { Component, Fragment } from "react";
import { Waypoint } from "react-waypoint";
import Message from "./Message.js";
import _ from "lodash";

class DateItem extends Component {
  isUserInside = true;
  state = {
    position: "inside"
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.stickZIndex !== nextProps.stickZIndex ||
      this.props.children !== nextProps.children ||
      this.state.position !== nextState.position ||
      this.props.hasMoreItems !== nextProps.hasMoreItems
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    // When Waypoint mountsit only calls waypoints on screen. But the parent needs
    // to know everyone's position. So we asume position = above if waypoint did called
    if (!this.state.position) {
      if (this.mounted) {
        this.setState({
          position: "above"
        });
      }
      if (this.props.onAbove) this.props.onAbove();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onEnter = ({ previousPosition, currentPosition }) => {
    if (this.props.hasMoreItems) {
      if (currentPosition === Waypoint.inside) {
        if (this.mounted) {
          this.setState({
            position: "inside"
          });
        }
        if (this.props.onInside) this.props.onInside();
      }
    }
  };
  onLeave = ({ previousPosition, currentPosition }) => {
    if (this.props.hasMoreItems) {
      if (currentPosition === Waypoint.above) {
        if (this.mounted) {
          this.setState({
            position: "above"
          });
        }
        if (this.props.onAbove) this.props.onAbove();
      }
    }
  };
  renderDate({ style = {}, children }) {
    return (
      <div
        style={{
          margin: "0 -20px 0 -20px",
          background: "#ffffff70",
          padding: "20px 0",
          textAlign: "center",
          marginBottom: "10px",
          ...style
        }}
      >
        {children}
      </div>
    );
  }
  render() {
    const { stickZIndex, showDate, children } = this.props;

    const stickStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: stickZIndex || 10,
      backgroundColor: "#add8e6",
      padding: "20px 37px 20px 20px",
      margin: "0 17px 0 0"
    };

    return (
      <Fragment>
        <Waypoint bottom="100%" onEnter={this.onEnter} onLeave={this.onLeave} />
        {this.renderDate({ style: {}, children })}
        {showDate ? this.renderDate({ style: stickStyles, children }) : null}
      </Fragment>
    );
  }
}
class MessageList extends Component {
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
    dateWaypoints: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.messages !== nextProps.messages ||
      this.state.restoreScroll !== nextState.restoreScroll ||
      this.state.hasMoreItems !== nextState.hasMoreItems ||
      this.state.previousClientHeight !== nextState.previousClientHeight ||
      this.state.previousScrollHeight !== nextState.previousScrollHeight ||
      this.state.previousScrollTop !== nextState.previousScrollTop ||
      this.state.dateWaypoints.length !== nextState.dateWaypoints.length ||
      this.props.messages.length !== nextProps.messages.length
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messages !== this.props.messages) {
      if (this.isUserInside) {
        this.scrollToBottom();
      }
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  fetchMore = () => {
    const { chatID, limit, messages, fetchMore } = this.props;
    // Wait for restoreScroll to take place, then do the call.

    // If not,things are going to play over each other.
    if (!this.state.hasMoreItems || this.state.restoreScroll) return;
    const cursor =
      messages.length > 0 ? messages[messages.length - 1].createdAt : null;

    fetchMore({
      variables: {
        chatID,
        limit,
        cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getMessages.messages < this.props.limit
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

        return previousResult;
      }
    });
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
    const {
      messages,
      hasMoreItems,
      children,
      currentUserID,
      handleEndScrollUp,
      fetchMore,
      t,
      dayjs,
      lang
    } = this.props;

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
        .map((item, index, groupList) => {
          const messageElements = item.messages
            .map((message, j, messageList) => {
              let props = {
                key: message.id,
                message,
                currentUserID,
                t
              };

              if (message.type === "alert" || message.type === "left") {
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
              // showDate={lastAboveDateWaypointIndex === index}
              // Keys won't collied because DateItems's dates are days appart from each other
              key={`messageDate-${item.date}`}
              hasMoreItems={hasMoreItems}
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
              onEnter={({ previousPosition }) => {
                if (messages.length > 0) {
                  handleEndScrollUp({
                    previousPosition,
                    fetchMore,
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
