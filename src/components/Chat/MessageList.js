import React, { Component, Fragment } from "react";
import Waypoint from "react-waypoint";
import Message from "./Message.js";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
  }
  state = {
    loading: false,
    hasMoreItems: true
  };

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }
  scrollToBot() {
    this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
  }

  handleEnd = (previousPosition, currentPosition, fetchMore, cursor) => {
    console.log("LOADING", this.state.loading);
    if (
      this.messagesRef &&
      this.messagesRef.current.scrollTop < 100 &&
      this.state.hasMoreItems &&
      !this.state.loading
    ) {
      if (
        (!previousPosition && currentPosition === Waypoint.inside) ||
        previousPosition === Waypoint.above
      ) {
        const { chatID, limit } = this.props;
        this.setState({ loading: true });
        fetchMore({
          variables: {
            chatID,
            limit,
            cursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            if (fetchMoreResult.getMessages.messages < this.props.limit) {
              this.setState({ hasMoreItems: false });
            }
            console.log("NEW", ...fetchMoreResult.getMessages.messages);
            console.log("OLD", ...previousResult.getMessages.messages);
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];

            return previousResult;
          }
        });
        this.setState({
          loading: false
        });
      }
    }
  };

  // UNSAFE_componentWillReceiveProps({ messages }) {
  //   if (
  //     this.props.messagesRef &&
  //     this.props.messagesRef.current.scrollTop < 100 &&
  //     this.props.messages &&
  //     messages &&
  //     this.props.messages.length !== messages.length
  //   ) {
  //     // 35 items
  //     const heightBeforeRender = this.props.messagesRef.current.scrollHeight;
  //     // wait for 70 items to render
  //     setTimeout(() => {
  //       this.props.messagesRef.current.scrollTop =
  //         this.props.messagesRef.current.scrollHeight - heightBeforeRender;
  //     }, 120);
  //   }
  // }
  // info = () => {
  //   message.info(
  //     moment(
  //       this.props.messages[this.props.messages.length - 1].createdAt
  //     ).format("dddd, MMMM Do YYYY")
  //   );
  // };
  render() {
    //LOADING CAUSED INFINITE LOOP
    const { messages, fetchMore } = this.props;
    return (
      <Fragment>
        <div
          className="chats"
          ref={this.messagesRef}
          style={{ backgroundColor: "#eee" }}
        >
          <Waypoint
            onEnter={({ previousPosition, currentPosition }) =>
              this.handleEnd(
                previousPosition,
                currentPosition,
                fetchMore,
                messages[messages.length - 1].createdAt
              )
            }
          />

          {[...messages].reverse().map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </Fragment>
    );
  }
}
export default MessageList;
