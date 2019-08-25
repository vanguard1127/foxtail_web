import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { GET_COMMENTS, NEW_MESSAGE_SUB } from "../../../queries";
import { Waypoint } from "react-waypoint";
import Messages from "./Messages/";

class ChatContent extends PureComponent {
  unsubscribe = null;
  state = {
    cursor: null,
    hasMoreItems: true
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleEnd = ({ previousPosition, currentPosition, fetchMore, cursor }) => {
    if (this.state.hasMoreItems) {
      if (previousPosition === Waypoint.below) {
        this.fetchData(fetchMore, cursor);
      }
      if (
        previousPosition === undefined &&
        currentPosition === Waypoint.inside
      ) {
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
    const { chatID, history, t, ErrorHandler, dayjs, limit, lang } = this.props;

    const { cursor, hasMoreItems } = this.state;
    return (
      <Query
        query={GET_COMMENTS}
        variables={{ chatID, limit, cursor }}
        fetch-policy="cache-and-network"
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          console.log("RENDERING");
          if (loading) {
            return <div>{t("Loading")}</div>;
          }
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
          //*****data doesnt update */
          if (
            data.getComments &&
            data.getComments !== null &&
            data.getComments.messages
          ) {
            messages = data.getComments.messages || [];
          }

          if (!this.unsubscribe) {
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
                console.log("Update sent", prev);
                return prev;
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
              handleEnd={this.handleEnd}
              fetchMore={fetchMore}
              limit={limit}
              dayjs={dayjs}
              t={t}
              lang={lang}
            />
          );
        }}
      </Query>
    );
  }
}

export default ChatContent;
