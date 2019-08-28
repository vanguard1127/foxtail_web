import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { GET_MESSAGES } from "../../../queries";
import Spinner from "../../common/Spinner";
import Messages from "./Messages/";

class ChatContent extends PureComponent {
  render() {
    const { chatID, currentUserID, t, ErrorHandler, dayjs, lang } = this.props;

    const { cursor, limit } = this.props;

    return (
      <div
        className="content"
        style={{ display: "flex", flexDirection: " column-reverse" }}
      >
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
                  calledName={"getMessages"}
                  userID={currentUserID}
                  targetID={chatID}
                  type="chat"
                />
              );
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
                subscribeToMore={subscribeToMore}
                limit={limit}
                dayjs={dayjs}
                lang={lang}
                ErrorHandler={ErrorHandler}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ChatContent;
