import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { GET_MESSAGES, NEW_MESSAGE_SUB } from "../../../queries";
import { Waypoint } from "react-waypoint";
import Spinner from "../../common/Spinner";
import Messages from "./Messages/";
let unsubscribe = null;
class ChatContent extends PureComponent {
  state = { hasMore: true };
  handleEndScrollUp = ({ previousPosition, fetchMore, cursor }) => {
    if (this.state.hasMore) {
      if (previousPosition === Waypoint.above) {
        this.fetchDataForScrollUp(fetchMore, cursor);
      }
    }
  };

  fetchDataForScrollUp = async (fetchMore, cursor) => {
    this.props.ErrorHandler.setBreadcrumb("fetch more messages");
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
          fetchMoreResult.getMessages.messages.length < limit
        ) {
          this.setState({ hasMore: false });
        }

        previousResult.getMessages.messages = [
          ...previousResult.getMessages.messages,
          ...fetchMoreResult.getMessages.messages
        ];

        return previousResult;
      }
    });
  };

  render() {
    const { chatID, currentUserID, t, ErrorHandler, dayjs } = this.props;

    const { cursor, limit } = this.props;

    return (
      <div
        className="content"
        style={{ display: "flex", flexDirection: " column-reverse" }}
      >
        {" "}
        <Query
          query={GET_MESSAGES}
          variables={{ chatID, limit, cursor }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t("common:Loading") + "..."} size="large" />
              );
            }
            if (error) {
              return (
                <ErrorHandler.report
                  error={error}
                  calledName={"getSettings"}
                  userID={currentUserID}
                  targetID={chatID}
                  type="chat"
                />
              );
            }

            if (!unsubscribe) {
              unsubscribe = subscribeToMore({
                document: NEW_MESSAGE_SUB,
                variables: {
                  chatID: chatID
                },
                updateQuery: (prev, { subscriptionData }) => {
                  const { newMessageSubscribe } = subscriptionData.data;

                  if (
                    !newMessageSubscribe ||
                    newMessageSubscribe.fromUser.id === currentUserID
                  ) {
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
              });
            }
            return (
              <Messages
                chatID={chatID}
                currentUserID={currentUserID}
                ref={this.Messages}
                t={t}
                messages={
                  data && data.getMessages ? data.getMessages.messages : []
                }
                fetchMore={fetchMore}
                handleEndScrollUp={this.handleEndScrollUp}
                limit={limit}
                dayjs={dayjs}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ChatContent;
