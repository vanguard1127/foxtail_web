import React, { Component } from "react";
import ChatActions from "./ChatActions";
class ChatInfo extends Component {
  //TODO: Test if this prevent new messages from getting shown
  render() {
    const {
      chatID,
      t,
      setBlockModalVisible,
      handleRemoveSelf,
      isOwner,
      ErrorHandler,
      leaveDialog
    } = this.props;

    return (
      <div className="col-xl-2">
        <div className="right">
          <div className="head" />
          <div className="content">
            <div className="functions">
              <ChatActions
                chatID={chatID}
                t={t}
                setBlockModalVisible={setBlockModalVisible}
                handleRemoveSelf={handleRemoveSelf}
                isOwner={isOwner}
                ErrorHandler={ErrorHandler}
                leaveDialog={leaveDialog}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatInfo;
