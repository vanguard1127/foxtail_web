import React, { Component, Fragment } from "react";
import { Waypoint } from "react-waypoint";
import Message from "./Message.js";
import _ from "lodash";

class DateItem extends Component {
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
    this.checkScrollTopToFetch(10);
    //  this.scrollToBot();
  }
  componentWillUnmount() {
    this.mounted = false;
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
    if (this.mounted) {
      this.setState({
        previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
        previousScrollTop: this.scrollWrapperRef.current.scrollTop,
        restoreScroll: false
      });
    }
  }
  scrollToBot() {
    const { hasScrolledBottomInitial } = this.props;
    console.log("Scrolling to Bottom");

    this.scrollWrapperRef.current.scrollTop = this.scrollWrapperRef.current.scrollHeight;
    if (this.mounted) {
      this.setState({
        previousClientHeight: this.scrollWrapperRef.current.clientHeight,
        previousScrollHeight: this.scrollWrapperRef.current.scrollHeight,
        previousScrollTop: this.scrollWrapperRef.current.scrollTop
      });
    }

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
      if (this.mounted) {
        this.setState({
          hasScrolledBottomInitial: true
        });
      }
    }
  }
  fetchMore = () => {
    const { chatID, limit, messages, fetchMore } = this.props;
    // Doesn't repeat because frist we are setting loading =  true
    // And on updateQuary, when the fetch it done. We set loading = false
    console.log("Can i fetch?", this.state.hasMoreItems);
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

        // if (this.mounted) {
        //   this.setState({
        //     loading: false,
        //     // When no more messages don't restore. It is not needed and it caused
        //     // the chat to restore on the next componentDidUpdate
        //     restoreScroll:
        //       !noMessagesLeft &&
        //       this.scrollWrapperRef.current.scrollHeight >
        //         this.scrollWrapperRef.current.clientHeight,
        //     dateWaypoints: []
        //   });
        // }

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
  onScroll = ev => {
    // Create scroll event handler here instead of on render for better performance.
    this.checkScrollTopToFetch(100);
  };
  checkScrollTopToFetch(THRESHOLD) {
    // Dont allow the user to scroll if loading more messages
    if (!this.state.hasMoreItems) {
      this.scrollWrapperRef.current.scrollTop = this.state.previousScrollTop;
    }
    // Keep around the scrollTop around to use later on restoreScroll & scrolltoBottom
    if (this.mounted) {
      this.setState({
        previousScrollTop: this.scrollWrapperRef.current.scrollTop
      });
    }
    if (this.state.hasMoreItems) {
      // If is close to the top, then fetch
      if (this.scrollWrapperRef.current.scrollTop < THRESHOLD) {
        this.fetchMore();
      }
    }
  }
  render() {
    console.log("List Message");
    const {
      messages,
      hasMoreItems,
      children,
      currentUserID,
      handleEndScrollUp,
      fetchMore,
      t,
      dayjs
    } = this.props;

    const messageElements = _.flatten(
      _.chain(messages)
        .groupBy(datum =>
          dayjs(datum.createdAt)
            .locale(localStorage.getItem("i18nextLng"))
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
              if (
                j === messageList.length - 1 &&
                index === groupList.length - 1
              ) {
                // Attach a ref to the last element for later measurement
                props.ref = this.lastMessageRef;
              }
              return <Message key={message.id} {...props} dayjs={dayjs} />;
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
          <div
            style={{
              position: "absolute",
              top: "30%"
            }}
          >
            <Waypoint
              onEnter={({ previousPosition }) => {
                console.log(previousPosition, "previous in messa");
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
          {messageElements}

          {children}
        </div>
      </div>
    );
  }
}
export default MessageList;
