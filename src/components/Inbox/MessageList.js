import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";
import { List } from "antd";
import moment from "moment";
import _ from "lodash";

class DateItem extends Component {
  state = {
    position: null
  };
  componentDidMount() {
    // When Waypoint mountsit only calls waypoints on screen. But the parent needs
    // to know everyone's position. So we asume position = above if waypoint did called
    if (!this.state.position) {
      this.setState({
        position: "above"
      });
      if (this.props.onAbove) this.props.onAbove();
    }
  }
  onEnter = ({ previousPosition, currentPosition }) => {
    if (currentPosition === Waypoint.inside) {
      this.setState({
        position: "inside"
      });
      if (this.props.onInside) this.props.onInside();
    }
  };
  onLeave = ({ previousPosition, currentPosition }) => {
    if (currentPosition === Waypoint.above) {
      this.setState({
        position: "above"
      });
      if (this.props.onAbove) this.props.onAbove();
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
    this.scrollWrapperRef = React.createRef();
    this.lastMessageRef = React.createRef();
  }
  state = {
    loading: false,
    restoreScroll: false,
    hasMoreItems: true,
    previousClientHeight: null,
    previousScrollHeight: null,
    previousScrollTop: null,
    dateWaypoints: []
  };
  unsubscribe = null;
  componentDidMount() {
    this.checkScrollTopToFetch(10);
    this.scrollToBot();
    if (this.props.subscribe) {
      this.unsubscribe = this.props.subscribe();
    }
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messages !== this.props.messages) {
      let isUserOnBottom = null;
      if (this.lastMessageRef.current) {
        // If the user is on the bottom waiting for new messages, scroll him whenever one gets received
        isUserOnBottom =
          this.scrollWrapperRef.current.clientHeight +
            this.scrollWrapperRef.current.scrollTop >
          this.scrollWrapperRef.current.scrollHeight -
            this.lastMessageRef.current.clientHeight -
            20;
      }
      if (!this.state.hasScrolledBottomInitial || isUserOnBottom) {
        // ComponentDidMount does not scrolls to bottom on initial mount. Since on
        // initial mount there are only 6 items, not enough to scroll. And since waypoint
        // is on view, because everything is on view, more messages get fetched,
        // which do need scroll.
        // So, for the scroll to start at the bottom when user firsts sees it,
        // either this or fetching more items initial mount
        if (!this.state.hasScrolledBottomInitial) {
          console.log("Initial Scroll Bottom");
        }
        this.scrollToBot();
      } else if (this.state.restoreScroll) {
        // When loading items, we dont want to have the scroll not move up or down.
        // We want the user to view the same items, without the scroll moving all over the place
        // So we restore it
        this.restoreScroll();
      }
    }
  }
  restoreScroll() {
    console.log("restoring");
    this.scrollWrapperRef.current.scrollTop =
      this.state.previousScrollTop +
      (this.scrollWrapperRef.current.scrollHeight -
        this.state.previousScrollHeight);

    this.setState({
      previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
      previousScrollTop: this.scrollWrapperRef.current.scrollTop,
      restoreScroll: false
    });
  }
  scrollToBot() {
    const { hasScrolledBottomInitial } = this.props;
    console.log("Scrolling to Bottom");

    this.scrollWrapperRef.current.scrollTop = this.scrollWrapperRef.current.scrollHeight;
    this.setState({
      previousClientHeight: this.scrollWrapperRef.current.clientHeight,
      previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
      previousScrollTop: this.scrollWrapperRef.current.scrollTop
    });

    // So view always should start at the bottom.
    // The idea is to scroll to bottom when the component is rendered with the messages
    // But, in componentDidMount all initial messages are not loaded yet.
    // So we fetch until all intial messages are loaded. Stoping when messages cover all the scrollview
    // or when there are not more messages. Then on componentDidUpdate, this gets
    // executed to scroll to bottom
    if (
      !hasScrolledBottomInitial &&
      this.scrollWrapperRef.current.scrollTop !== 0
    ) {
      this.setState({
        hasScrolledBottomInitial: true
      });
    }
  }
  fetchMore = () => {
    const { chatID, limit, messages, fetchMore } = this.props;
    // Doesn't repeat because frist we are setting loading =  true
    // And on updateQuary, when the fetch it done. We set loading = false
    console.log("Can i fetch?", !this.state.loading && this.state.hasMoreItems);
    // Wait for restoreScroll to take place, then do the call.
    // If not,things are going to play over each other.
    if (
      this.state.loading ||
      !this.state.hasMoreItems ||
      this.state.restoreScroll
    )
      return;
    const cursor =
      messages.length > 0 ? messages[messages.length - 1].createdAt : null;
    console.log("c", messages, cursor);
    this.setState({ loading: true });
    fetchMore({
      variables: {
        chatID,
        limit,
        cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        console.log(previousResult, fetchMoreResult);
        const noMessagesLeft =
          fetchMoreResult.getMessages &&
          fetchMoreResult.getMessages.messages < this.props.limit;
        if (noMessagesLeft) {
          this.setState({ hasMoreItems: false });
        }
        console.log("more", noMessagesLeft);
        if (previousResult.getMessages) {
          previousResult.getMessages.messages = [
            ...previousResult.getMessages.messages,
            ...fetchMoreResult.getMessages.messages
          ];
        } else {
          previousResult.getMessages = fetchMoreResult.getMessages;
        }
        console.log("Fetch done");

        this.setState({
          loading: false,
          // When no more messages don't restore. It is not needed and it caused
          // the chat to restore on the next componentDidUpdate
          restoreScroll:
            !noMessagesLeft &&
            this.scrollWrapperRef.current.scrollHeight >
              this.scrollWrapperRef.current.clientHeight,
          dateWaypoints: []
        });

        return previousResult;
      }
    });
  };
  renderTopMessage = message => {
    return <List.Item style={{ color: "blue" }}>{message}</List.Item>;
  };
  onDateWaypointPostion = (i, position) => {
    if (this.state.dateWaypoints[i] === position) return;
    //
    // Perhaps find another way to tell the parent children position
    // parent needs children position to tell the alst above item to render as absolute
    const newDateWaypoints = this.state.dateWaypoints;
    newDateWaypoints[i] = position;
    this.setState({
      dateWaypoints: newDateWaypoints
    });
  };
  onScroll = ev => {
    // Create scroll event handler here instead of on render for better performance.
    this.checkScrollTopToFetch(100);
  };
  checkScrollTopToFetch(THRESHOLD) {
    // Dont allow the user to scroll if loading more messages
    if (this.state.loading) {
      this.scrollWrapperRef.current.scrollTop = this.state.previousScrollTop;
    }
    // Keep around the scrollTop around to use later on restoreScroll & scrolltoBottom
    this.setState({
      previousScrollTop: this.scrollWrapperRef.current.scrollTop
    });
    // If is close to the top, then fetch
    if (this.scrollWrapperRef.current.scrollTop < THRESHOLD) {
      this.fetchMore();
    }
  }
  render() {
    const { loading } = this.state;
    const { messages, hasMoreItems, children, currentUserID } = this.props;
    let topMessage = "default";
    if (loading) {
      topMessage = "loading...";
    } else if (!hasMoreItems) {
      topMessage = "Looks like there is nothing else to see here";
    }

    const lastAboveDateWaypointIndex = this.state.dateWaypoints.reduce(
      (res, cur, i) => {
        if (cur === "above") return i;
        return res;
      },
      0
    ); // default to first item when none are above.

    const messageElements = _.flatten(
      _.chain(messages)
        .groupBy(datum =>
          moment(datum.createdAt)
            .format("dddd, MMMM Do YYYY")
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
                currentUserID
              };
              if (
                j === messageList.length - 1 &&
                index === groupList.length - 1
              ) {
                // Attach a ref to the last element for later measurement
                props.ref = this.lastMessageRef;
              }
              return <Message key={message.id} {...props} />;
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
              showDate={lastAboveDateWaypointIndex === index}
              // Keys won't collied because DateItems's dates are days appart from each other
              key={`messageDate-${item.date}`}
            >
              {item.date}
            </DateItem>
          );
          return [dateElement].concat(messageElements);
        })
        .value()
    );

    return (
      <div ref={this.scrollWrapperRef} onScroll={this.onScroll}>
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
          {this.renderTopMessage(topMessage)}
          {messageElements}

          {children}
        </div>
      </div>
    );
  }
}
export default MessageList;
