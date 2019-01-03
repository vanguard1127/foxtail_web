import React, { Component, Fragment } from "react";

import withAuth from "../withAuth";
import InboxPanel from "./InboxPanel";
import Header from "./Header";
import ChatInfo from "./ChatInfo";
import { GET_COUNTS, READ_CHAT } from "../../queries";
import { Mutation } from "react-apollo";
import ChatWindow from "./ChatWindow";

class InboxPage extends Component {
  state = { chatID: null, chat: null };

  handleChatClick = (chatID, readChat) => {
    this.setState({ chatID }, () => {
      readChat()
        .then(({ data }) => {
          this.setState({ chat: data.readChat });
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });
          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  updateCount = cache => {
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });
    //TODO: set to remove num of msgs
    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts: {
          ...getCounts,
          msgsCount: getCounts.msgsCount - 1
        }
      }
    });
  };

  render() {
    const { currentuser } = this.props.session;
    let { chatID, chat } = this.state;
    chatID = this.state.chatID;
    if (chatID === null) {
      chatID = this.props.match.params.chatID;
      if (chatID === "null" || chatID === undefined) {
        chatID = null;
      }
    }
    const inboxPanel = (
      <Mutation
        mutation={READ_CHAT}
        variables={{ chatID }}
        update={this.updateCount}
      >
        {readChat => {
          return (
            <InboxPanel
              readChat={id => this.handleChatClick(id, readChat)}
              currentUserID={currentuser.userID}
            />
          );
        }}
      </Mutation>
    );

    return (
      <div>
        <Header />
        <section className="inbox">
          <div className="row no-gutters">
            {inboxPanel}
            <ChatWindow currentChat={chat} currentuser={currentuser} />
            <ChatInfo />
          </div>
        </section>
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(InboxPage);
