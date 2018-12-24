import React from "react";
import { GET_CHAT } from "../../queries";
import { Query } from "react-apollo";
import Spinner from "../common/Spinner";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";
const ChatWindow = ({ chatID, currentuser }) => {
  return (
    <Query query={GET_CHAT} variables={{ chatID }} fetchPolicy="cache-first">
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

        const currentChat = data.chat;
        return (
          <div className="col-md-8 col-lg-9 col-xl-7">
            <div className="chat">
              <ChatHeader currentChat={currentChat} currentuser={currentuser} />
              <ChatContent
                chatID={currentChat.id}
                currentUserID={currentuser.userID}
              />
              <ChatPanel chatID={currentChat.id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default ChatWindow;
