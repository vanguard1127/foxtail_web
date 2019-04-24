import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_COMMENTS, NEW_MESSAGE_SUB } from "../../../queries";
import { Waypoint } from "react-waypoint";
import Messages from "./Messages/";
let unsubscribe = null;

class ChatContent extends Component {
  state = {
    cursor: null,
    hasMoreItems: true
  };

  handleEnd = ({ previousPosition, currentPosition, fetchMore, cursor }) => {
    if (this.state.hasMoreItems) {
      if (previousPosition === Waypoint.below) {
        console.log("LOAD");
        this.fetchData(fetchMore, cursor);
      }
      if (
        previousPosition === undefined &&
        currentPosition === Waypoint.inside
      ) {
        console.log("NONe");

        this.setState({ hasMoreItems: false });
      }
    }
  };

  fetchData = async (fetchMore, cursor) => {
    this.props.ErrorHandler.setBreadcrumb("Fetch more comments");

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

        return previousResult.getComments
          ? previousResult.getComments
          : { data: previousResult };
      }
    });
  };

  render() {
    const { chatID, history, t, ErrorHandler, dayjs, limit } = this.props;

    const { cursor, hasMoreItems } = this.state;
    return (
      <Query
        query={GET_COMMENTS}
        variables={{ chatID, limit, cursor }}
        fetch-policy="cache-and-network"
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          if (error || !data) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getCommets"}
                id={chatID}
                type="chat"
              />
            );
          }

          let messages = [];

          if (
            data.getComments &&
            data.getComments !== null &&
            data.getComments.messages
          ) {
            messages = data.getComments.messages || [];
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
                  prev.getComments = {
                    messages: [],
                    __typename: "ChatType"
                  };
                  return prev;
                } else {
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
                }
                return prev.getComments ? prev.getComments : { data: prev };
              }
            });
          }

          return (
            <Messages
              loading={hasMoreItems}
              chatID={chatID}
              ref={this.Messages}
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
                    return prev.getComments ? prev.getComments : { data: prev };
                  }
                })
              }
              handleEnd={this.handleEnd}
              fetchMore={fetchMore}
              limit={limit}
              dayjs={dayjs}
              t={t}
            />
          );
        }}
      </Query>
    );
  }
}

export default ChatContent;
