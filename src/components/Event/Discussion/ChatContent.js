import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { GET_COMMENTS } from "../../../queries";
import Messages from "./Messages/";

class ChatContent extends PureComponent {
  render() {
    const { chatID, history, t, ErrorHandler, dayjs, limit, lang } = this.props;

    return (
      <Query
        query={GET_COMMENTS}
        variables={{ chatID, limit }}
        fetch-policy="cache-first"
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
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

          return (
            <Messages
              subscribeToMore={subscribeToMore}
              chatID={chatID}
              ref={this.Messages}
              history={history}
              messages={messages}
              fetchMore={fetchMore}
              limit={limit}
              dayjs={dayjs}
              t={t}
              lang={lang}
              ErrorHandler={ErrorHandler}
            />
          );
        }}
      </Query>
    );
  }
}

export default ChatContent;
