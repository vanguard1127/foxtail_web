import React, { PureComponent } from 'react';
import Waypoint from 'react-waypoint';
import Message from './Message.js';

class MessageList extends PureComponent {
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
    // this.checkScrollTopToFetch(10);
    // this.scrollToBot();
    this.mounted = true;
    if (this.props.subscribe) {
      this.unsubscribe = this.props.subscribe();
    }
  }
  componentWillUnmount() {
    this.mounted = false;
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
          console.log('Initial Scroll Bottom');
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
    console.log('restoring');
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
    console.log('Scrolling to Bottom');

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
    console.log('Can i fetch?', !this.state.loading && this.state.hasMoreItems);
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
    if (this.mounted) {
      this.setState({ loading: true });
    }
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
          if (this.mounted) {
            this.setState({ hasMoreItems: false });
          }
        }
        console.log('more', noMessagesLeft);
        if (previousResult.getMessages) {
          previousResult.getMessages.messages = [
            ...previousResult.getMessages.messages,
            ...fetchMoreResult.getMessages.messages
          ];
        } else {
          previousResult.getMessages = fetchMoreResult.getMessages;
        }

        if (this.mounted) {
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
    if (this.mounted) {
      this.setState({
        previousScrollTop: this.scrollWrapperRef.current.scrollTop
      });
    }
    // If is close to the top, then fetch
    if (this.scrollWrapperRef.current.scrollTop < THRESHOLD) {
      this.fetchMore();
    }
  }
  render() {
    const { loading } = this.state;
    const { messages, hasMoreItems, children, history, dayjs } = this.props;

    if (messages.length === 0) {
      return <div>No messages yet</div>;
    }
    const messageElements = messages.map(message => {
      return (
        <Message
          key={message.id}
          message={message}
          history={history}
          dayjs={dayjs}
        />
      );
    });

    return (
      <div
        className="messages"
        ref={this.scrollWrapperRef}
        onScroll={this.onScroll}
      >
        {messageElements}

        {children}
      </div>
    );
  }
}
export default MessageList;
