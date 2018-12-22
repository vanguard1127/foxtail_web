import React, { Component, Fragment } from "react";
import InboxPanel from "../common/InboxPanel";
import ChatPanel from "../common/ChatPanel";
import withAuth from "../withAuth";

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
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "horizontal",
          height: "86vh"
        }}
      >
        <Fragment>
          <InboxPanel
            setChatID={this.setChatID}
            currentUserID={currentuser.userID}
          />
          <ChatPanel chatID={chatID} currentuser={currentuser} />
        </Fragment>
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(InboxPage);
