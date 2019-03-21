import React, { PureComponent } from "react";
import ChatHeader from "./ChatHeader";
import AdManager from "../common/AdManager";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";

const LIMIT = 6;
class ChatWindow extends PureComponent {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true,
    limit: LIMIT
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  render() {
    const { currentChat, currentuser, t, ErrorHandler, dayjs } = this.props;
    if (currentChat !== null) {
      sessionStorage.setItem("pid", currentChat.id);
    } else {
      sessionStorage.setItem("pid", null);
    }
    return (
      <div className="col-md-8 col-lg-9 col-xl-7">
        {currentChat !== null ? (
          <div className="chat">
            <ChatHeader
              currentChat={currentChat}
              currentuser={currentuser}
              t={t}
            />
            <ChatContent
              chatID={currentChat.id}
              currentUserID={currentuser.userID}
              t={t}
              ErrorHandler={ErrorHandler}
              loading={false}
              cursor={null}
              hasMoreItems={true}
              limit={LIMIT}
              dayjs={dayjs}
            />
            <ChatPanel
              chatID={currentChat.id}
              t={t}
              ErrorHandler={ErrorHandler}
              currentuser={currentuser}
              cursor={null}
              limit={LIMIT}
            />
          </div>
        ) : (
          <AdManager />
        )}
      </div>
    );
  }
}
export default ChatWindow;
