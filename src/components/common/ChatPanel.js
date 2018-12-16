import React, { Component, Fragment } from "react";
import { GET_CHAT } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "../common/Spinner";
import TimeAgo from "../common/TimeAgo";
import Chatroom from "../Chat/Chatroom";
class InboxList extends Component {
  //Variables by text
  render() {
    const { chatID } = this.props;

    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "horizontal" }}>
        <Query
          query={GET_CHAT}
          variables={{ chatID }}
          fetchPolicy="cache-and-network"
        >
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }

            if (!data || !data.chat) {
              return <div>No chat</div>;
            }

            if (!data.chat.messages) {
              return <div>No messages</div>;
            }

            const messages = data.chat.messages;

            const currentChat = data.chat;
            let chatTitle = "No chats available";
            let chatTitleExtra = "";
            let chatLastSeen = "";
            if (currentChat) {
              chatTitle = `${currentChat.participants[0].profileName}`;
              chatLastSeen = TimeAgo(currentChat.participants[0].updatedAt);
              if (currentChat.participants.length > 2) {
                chatTitleExtra = ` + ${currentChat.participants.length -
                  2} participants`;
                chatTitle = `${chatTitle}`;
              }
            }

            if (!messages || messages.length === 0) {
              return <div>No Messages Available</div>;
            }
            return (
              <Fragment>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    flexDirection: "horizontal",
                    backgroundColor: "blue"
                  }}
                >
                  <Chatroom
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column"
                    }}
                    title={chatTitle}
                    titleExtra={chatTitleExtra}
                    lastSeen={chatLastSeen}
                    chatID={chatID}
                  />
                </div>
              </Fragment>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default InboxList;
