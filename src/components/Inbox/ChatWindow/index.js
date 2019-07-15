import React, { PureComponent } from "react";
import ChatHeader from "./ChatHeader";
import AdManager from "../../common/Ad";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";
import { INBOXMSG_LIMIT } from "../../../docs/consts";

class ChatWindow extends PureComponent {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true,
    limit: INBOXMSG_LIMIT
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  onMenuClick = state => {
    this.props.history.push({
      state,
      pathname: "/settings"
    });
  };

  onAddCouple = () => {
    this.onMenuClick({ showCplMdl: true });
  };

  onShowBlackMember = () => {
    this.onMenuClick({ showBlkMdl: true });
  };

  render() {
    const {
      currentChat,
      currentuser,
      t,
      ErrorHandler,
      dayjs,
      chatOpen,
      setBlockModalVisible,
      handleRemoveSelf,
      isOwner,
      leaveDialog,
      lang,
      ReactGA
    } = this.props;
    if (currentChat !== null) {
      sessionStorage.setItem("pid", currentChat.id);
    } else {
      sessionStorage.setItem("pid", null);
    }
    return (
      <div className="col-md-8 col-lg-9 col-xl-7">
        {currentChat !== null ? (
          <div className={chatOpen ? "chat show" : "chat"}>
            <ChatHeader
              currentChat={currentChat}
              currentuser={currentuser}
              t={t}
              chatID={currentChat.id}
              setBlockModalVisible={setBlockModalVisible}
              handleRemoveSelf={handleRemoveSelf}
              isOwner={isOwner}
              ErrorHandler={ErrorHandler}
              leaveDialog={leaveDialog}
              ReactGA={ReactGA}
            />
            <ChatContent
              chatID={currentChat.id}
              currentUserID={currentuser.userID}
              t={t}
              ErrorHandler={ErrorHandler}
              loading={false}
              cursor={null}
              hasMoreItems={true}
              limit={INBOXMSG_LIMIT}
              dayjs={dayjs}
              lang={lang}
            />
            <ChatPanel
              chatID={currentChat.id}
              t={t}
              ErrorHandler={ErrorHandler}
              currentuser={currentuser}
              cursor={null}
              limit={INBOXMSG_LIMIT}
            />
          </div>
        ) : (
          <AdManager
            t={t}
            goToBlk={this.onShowBlackMember}
            goToCpl={this.onAddCouple}
          />
        )}
      </div>
    );
  }
}
export default ChatWindow;
