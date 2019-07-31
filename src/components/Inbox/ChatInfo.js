import React, { PureComponent } from "react";
import ChatActions from "./ChatWindow/ChatActions";
class ChatInfo extends PureComponent {
  render() {
    const {
      chatID,
      t,
      setBlockModalVisible,
      handleRemoveSelf,
      isOwner,
      ErrorHandler,
      leaveDialog,
      ReactGA,
      participantsNum
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
                ReactGA={ReactGA}
                participantsNum={participantsNum}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatInfo;
