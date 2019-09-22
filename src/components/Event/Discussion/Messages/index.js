import React, { Component } from "react";
import Message from "./Message.js";
import { NEW_MESSAGE_SUB } from "../../../../queries";
import { Waypoint } from "react-waypoint";
import { resultKeyNameFromField } from "apollo-utilities";

class MessageList extends Component {
  unsubscribe;
  state = {
    hasMoreItems: true,
    messages: this.props.messages
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.messages.length !== nextState.messages.length ||
      this.state.hasMoreItems !== nextState.hasMoreItems ||
      this.props.chatID !== nextProps.chatID ||
      this.props.loading !== nextProps.loading ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.mounted = true;
    this.subscribeToNewMsgs();
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  subscribeToNewMsgs = () => {
    const { subscribeToMore, chatID } = this.props;

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
        if (prev.getComments) {
          prev.getComments.messages = [
            newMessageSubscribe,
            ...prev.getComments.messages
          ];
        } else {
          prev.getComments = {
            messages: [newMessageSubscribe],
            __typename: "ChatType"
          };
        }
        if (this.mounted) {
          this.setState({ messages: prev.getComments.messages });
        }
        return prev;
      }
    });
  };

  handleEnd = ({ previousPosition, currentPosition, cursor }) => {
    if (this.state.hasMoreItems) {
      if (previousPosition === Waypoint.below) {
        this.fetchData(cursor);
      } else if (
        previousPosition === undefined &&
        currentPosition === Waypoint.inside
      ) {
        if (this.mounted) {
          this.setState({ hasMoreItems: false });
        }
      }
    }
  };

  fetchData = async cursor => {
    const { fetchMore, ErrorHandler } = this.props;
    ErrorHandler.setBreadcrumb("Fetch more comments");
    if (this.mounted) {
      const { chatID, limit } = this.props;
      fetchMore({
        variables: {
          chatID,
          limit,
          cursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (
            !fetchMoreResult ||
            fetchMoreResult.getComments.messages.length < limit
          ) {
            this.setState({ hasMoreItems: false });
          }

          previousResult.getComments.messages = [
            ...previousResult.getComments.messages,
            ...fetchMoreResult.getComments.messages
          ];
          this.setState({ messages: previousResult.getComments.messages });

          return previousResult.getComments
            ? previousResult.getComments
            : { data: previousResult };
        }
      });
    }
  };

  render() {
    const { history, dayjs, loading, t, lang } = this.props;
    const { messages } = this.state;
    if (messages.length === 0) {
      return (
        <div className="item" style={{ textAlign: "center" }}>
          {t("nocomm")}
        </div>
      );
    }

    const messageElements = messages.map(message => {
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
              this.handleEnd({
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
  }
}
export default MessageList;
