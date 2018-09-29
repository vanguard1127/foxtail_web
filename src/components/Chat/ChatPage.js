import React, { Component } from "react";

import Chatroom from "./Chatroom.js";

class ChatPage extends Component {
  render() {
    return (
      <div>
        <div style={{ width: "100px", height: "300px", display: "block" }}>
          Inbox
        </div>
        <Chatroom />
        <div style={{ width: "100px", height: "300px", display: "block" }}>
          Users
        </div>
      </div>
    );
  }
}

export default ChatPage;
