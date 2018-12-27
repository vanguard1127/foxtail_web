import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_MESSAGES, NEW_MESSAGE_SUB } from "../../queries";
import Waypoint from "react-waypoint";
import Spinner from "../common/Spinner";
import MessageList from "./MessageList";

const LIMIT = 6;
class ChatContent extends Component {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true
  };

  handleEnd = (previousPosition, currentPosition, fetchMore, cursor) => {
    if (
      this.messagesRef &&
      this.messagesRef.current.scrollTop < 100 &&
      this.state.hasMoreItems &&
      this.state.loading !== true
    ) {
      if (
        (!previousPosition && currentPosition === Waypoint.inside) ||
        previousPosition === Waypoint.above
      ) {
        const { chatID } = this.props;
        this.setState({ loading: true });
        fetchMore({
          variables: {
            chatID,
            limit: LIMIT,
            cursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            if (fetchMoreResult.getMessages.messages < LIMIT) {
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

  fetchData = async (fetchMore, cursor) => {
    // not beign used
    const { chatID } = this.props;
    this.setState({ loading: true });
    fetchMore({
      variables: {
        chatID,
        limit: LIMIT,
        cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        if (fetchMoreResult.getMessages.messages < LIMIT) {
          this.setState({ hasMoreItems: false });
        }

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
  };
  render() {
    const { chatID, currentUserID } = this.props;

    const { cursor } = this.state;
    return (
      <div
        className="content"
        style={{ display: "flex", flexDirection: " column-reverse" }}
      >
        {" "}
        <Query
          query={GET_MESSAGES}
          variables={{ chatID, limit: LIMIT, cursor }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (!data.getMessages) {
              return <div>No messages</div>;
            }

            return (
              <MessageList
                chatID={chatID}
                currentUserID={currentUserID}
                ref={this.MessageList}
                messages={
                  data && data.getMessages ? data.getMessages.messages : []
                }
                subscribe={() =>
                  subscribeToMore({
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
                      return prev;
                    }
                  })
                }
                handleEnd={this.handleEnd}
                fetchMore={fetchMore}
                limit={LIMIT}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ChatContent;
