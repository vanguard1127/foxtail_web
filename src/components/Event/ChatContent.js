import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_COMMENTS, NEW_MESSAGE_SUB } from "../../queries";
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

            if (fetchMoreResult.getComments.messages < LIMIT) {
              this.setState({ hasMoreItems: false });
            }
            console.log("NEW", ...fetchMoreResult.getComments.messages);
            console.log("OLD", ...previousResult.getComments.messages);
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
    const { chatID, history, t } = this.props;

    const { cursor } = this.state;
    return (
      <Query
        query={GET_COMMENTS}
        variables={{ chatID, limit: LIMIT, cursor }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          if (loading) {
            return (
              <Spinner message={t("common:Loading") + "..."} size="large" />
            );
          }

          if (!data || !data.getComments) {
            return <div>{t("commmon:nomsgs")}</div>;
          }

          return (
            <MessageList
              chatID={chatID}
              ref={this.MessageList}
              history={history}
              messages={
                data && data.getComments ? data.getComments.messages : []
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
            />
          );
        }}
      </Query>
    );
  }
}

export default ChatContent;
