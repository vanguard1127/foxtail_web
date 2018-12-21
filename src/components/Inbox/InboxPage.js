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
        <Fragment>
          <InboxPanel setChatID={this.setChatID} />
          <ChatPanel chatID={chatID} />
        </Fragment>
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(InboxPage);
