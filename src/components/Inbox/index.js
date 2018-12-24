import React, { Component, Fragment } from "react";

import withAuth from "../withAuth";
import InboxPanel from "./InboxPanel";
import Header from "./Header";
import ChatInfo from "./ChatInfo";
import ChatWindow from "./ChatWindow";

class InboxPage extends Component {
  state = { chatID: null };

  setChatID = (e, chatID) => {
    e.preventDefault();
    this.setState({ chatID });
  };

  render() {
    let chatID;
    const { currentuser } = this.props.session;
    chatID = this.state.chatID;
    if (chatID === null) {
      chatID = this.props.match.params.chatID;
      if (chatID === "null" || chatID === undefined) {
        chatID = null;
      }
    }
    return (
      <div>
        <Header />
        <section className="inbox">
          <div className="row no-gutters">
            <InboxPanel
              setChatID={this.setChatID}
              currentUserID={currentuser.userID}
            />
            <ChatWindow chatID={chatID} currentuser={currentuser} />
            <ChatInfo />
          </div>
        </section>
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(InboxPage);
