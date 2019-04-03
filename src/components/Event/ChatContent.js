import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_COMMENTS, NEW_MESSAGE_SUB } from "../../queries";
import { Waypoint } from "react-waypoint";
import Spinner from "../common/Spinner";
import MessageList from "./MessageList";
let unsubscribe = null;
const LIMIT = 4;
class ChatContent extends Component {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true
  };

  handleEnd = ({ previousPosition, fetchMore, cursor }) => {
    if (previousPosition === Waypoint.below) {
      this.fetchData(fetchMore, cursor);
    }
  };

  fetchData = async (fetchMore, cursor) => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more comments");
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

        if (fetchMoreResult.getComments.messages < LIMIT) {
          this.setState({ hasMoreItems: false });
        }

        previousResult.getComments.messages = [
          ...previousResult.getComments.messages,
          ...fetchMoreResult.getComments.messages
        ];

        return previousResult;
      }
    });
    this.setState({
      loading: false
    });
  };

  render() {
    const { chatID, history, t, ErrorHandler, dayjs } = this.props;

    const { cursor } = this.state;
    return (
      <Query query={GET_COMMENTS} variables={{ chatID, limit: LIMIT, cursor }}>
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          if (loading) {
            return (
              <Spinner message={t("common:Loading") + "..."} size="large" />
            );
          }
          if (error || !data) {
            return (
              <ErrorHandler.report error={error} calledName={"getCommets"} />
            );
          }

          let messages = [];

          if (data.getComments && data.getComments.messages) {
            messages = data.getComments.messages;
          }

          if (!unsubscribe) {
            unsubscribe = subscribeToMore({
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
                return prev;
              }
            });
          }

          if (messages.length === 0) {
            return <div>No messages yet</div>;
          }
          return (
            <MessageList
              chatID={chatID}
              ref={this.MessageList}
              history={history}
              messages={messages}
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
                    return prev;
                  }
                })
              }
              handleEnd={this.handleEnd}
              fetchMore={fetchMore}
              limit={LIMIT}
              dayjs={dayjs}
            />
          );
        }}
      </Query>
    );
  }
}

export default ChatContent;
