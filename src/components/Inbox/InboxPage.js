import React, { Component, Fragment } from "react";
<<<<<<< HEAD
import InboxPanel from "../common/InboxPanel";
import ChatPanel from "../common/ChatPanel";
import withAuth from "../withAuth";

=======
import { Query } from "react-apollo";
import { GET_INBOX, NEW_INBOX_SUB } from "../../queries";
import { List, Avatar, Badge, Divider } from "antd";
import Waypoint from "react-waypoint";
import Chatroom from "../Chat/Chatroom";
import TimeAgo from "../common/TimeAgo";
import Spinner from "../common/Spinner";
import withAuth from "../withAuth";

const LIMIT = 10;

class InboxList extends Component {
  unsubscribe = null;
  componentDidMount() {
    if (this.props.subscribe) {
      this.unsubscribe = this.props.subscribe();
    }
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  renderItem = (item, timeAgo, isCurrentChat) => {
    const { setChatID } = this.props;
    return (
      <List.Item
        key={item.id}
        style={{
          backgroundColor: isCurrentChat ? "#ffffff40" : "",

          margin: "0 -10px",
          paddingLeft: "10px",
          paddingRight: "10px"
        }}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={timeAgo === "Online"}>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </Badge>
          }
          title={
            <a onClick={e => setChatID(e, item.chatID)}>{item.fromUser}</a>
          }
          description={item.text}
        />
        <div>{timeAgo}</div>
      </List.Item>
    );
  };
  renderMsgList = ({ messages, onlineOnly }) => {
    const { chatID } = this.props;
    return (
      <Fragment>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.participants[0].updatedAt);
          let isCurrentChat = false;
          if (chatID === message.chatID) {
            isCurrentChat = true;
          } else if (!chatID) {
            isCurrentChat = i === 0;
          }
          if (onlineOnly) {
            if (timeAgo === "Online") {
              return this.renderItem(message, timeAgo, isCurrentChat);
            }
            return null;
          } else if (timeAgo !== "Online") {
            return this.renderItem(message, timeAgo, isCurrentChat);
          }
          return null;
        })}
      </Fragment>
    );
  };

  render() {
    const { messages } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "horizontal",
          backgroundColor: "red"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            backgroundColor: "lightblue",
            padding: "10px"
          }}
        >
          <Divider className="chatList-divider" orientation="left">
            Online
          </Divider>
          {this.renderMsgList({ messages, onlineOnly: true })}
          <Divider />
          {this.renderMsgList({ messages, onlineOnly: false })}
          {/* <Waypoint
                      onEnter={({ previousPosition }) =>
                        this.handleEnd(previousPosition, fetchMore)
                      }
                    /> */}
        </div>
      </div>
    );
  }
}
>>>>>>> origin/editprofile-image-manipulation
class InboxPage extends Component {
  state = { chatID: null };

  setChatID = (e, chatID) => {
    e.preventDefault();
    this.setState({ chatID });
  };

  render() {
    const { chatID } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "horizontal",
          height: "86vh"
        }}
      >
<<<<<<< HEAD
        <Fragment>
          <InboxPanel setChatID={this.setChatID} />
          <ChatPanel chatID={chatID} />
        </Fragment>
=======
        <List.Item.Meta
          avatar={
            <Badge dot={timeAgo === "Online"}>
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </Badge>
          }
          title={
            <a onClick={e => this.setChatID(e, item.chatID)}>{item.fromUser}</a>
          }
          description={item.text}
        />
        <div>{timeAgo}</div>
      </List.Item>
    );
  };

  renderMsgList = ({ messages, onlineOnly }) => {
    console.log("messages", messages);
    return (
      <Fragment>
        {messages.map((message, i) => {
          var timeAgo = TimeAgo(message.participants[0].updatedAt);
          let isCurrentChat = false;
          if (this.state.chatID === message.chatID) {
            isCurrentChat = true;
          } else if (!this.state.chatID) {
            isCurrentChat = i === 0;
          }
          if (onlineOnly) {
            if (timeAgo === "Online") {
              return this.renderItem(message, timeAgo, isCurrentChat);
            }
            return null;
          } else if (timeAgo !== "Online") {
            return this.renderItem(message, timeAgo, isCurrentChat);
          }
          return null;
        })}
      </Fragment>
    );
  };

  render() {
    let unsubscribe = null;
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "horizontal" }}>
        <Query query={GET_INBOX} fetchPolicy="cache-and-network">
          {({ data, loading, error, subscribeToMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            }
            if (!data.getInbox) {
              return <div>No messages</div>;
            }

            if (!unsubscribe && false) {
              // unsubscribe = subscribeToMore({
              //   document: NEW_MESSAGE_SUB,
              //   updateQuery: (prev, { subscriptionData }) => {
              //     const { newMessageSubscribe } = subscriptionData.data;
              //     console.log("SUBSCRIBE EXECUTED");
              //     if (!newMessageSubscribe) {
              //       return prev;
              //     }
              //     prev.getInbox.messages = [
              //       newMessageSubscribe,
              //       ...prev.getInbox.messages
              //     ];
              //     return prev;
              //   }
              // });
            }

            const messages = data.getInbox;
            // If a chat has not been selected. Default to first chat if any
            let chatID = this.state.chatID;
            if (!chatID && messages.length > 0) {
              chatID = messages[0].chatID;
            }
            const currentChat = messages.reduce((res, cur) => {
              if (cur.chatID === chatID) {
                return cur;
              }
              return res;
            }, messages[0]);
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
                <InboxList
                  messages={messages}
                  chatID={this.state.chatID}
                  setChatID={this.setChatID}
                  subscribe={() =>
                    subscribeToMore({
                      document: NEW_INBOX_SUB,
                      updateQuery: (prev, { subscriptionData }) => {
                        const { newMessageSubscribe } = subscriptionData.data;
                        console.log(
                          "SUBSCRIBE INBOX EXECUTED",
                          subscriptionData,
                          prev
                        );
                        if (!newMessageSubscribe) {
                          return prev;
                        }
                        const chatObject = prev.getInbox.filter(
                          chat => chat.chatID === newMessageSubscribe.chatID
                        )[0];
                        if (chatObject) {
                          chatObject.text = newMessageSubscribe.text;
                          chatObject.fromUser = newMessageSubscribe.fromUser;
                          chatObject.id = newMessageSubscribe.id;
                          chatObject.profilePic =
                            newMessageSubscribe.profilePic;
                        } else {
                          // prev.push({ chatID: newMessageSubscribe });
                        }
                        // if (prev.getMessages) {
                        //   prev.getMessages.messages = [
                        //     newMessageSubscribe,
                        //     ...prev.getMessages.messages
                        //   ];
                        // } else {
                        //   prev.getMessages = {
                        //     messages: [newMessageSubscribe],
                        //     __typename: "ChatType"
                        //   };
                        // }
                        // console.log(prev.getMessages);

                        return prev;
                      }
                    })
                  }
                />
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    flexDirection: "horizontal",
                    backgroundColor: "blue"
                  }}
                >
                  {" "}
                  <Chatroom
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column"
                    }}
                    participants={currentChat.participants}
                    lastSeen={chatLastSeen}
                    chatID={chatID}
                  />
                </div>
              </Fragment>
            );
          }}
        </Query>
>>>>>>> origin/editprofile-image-manipulation
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(InboxPage);
