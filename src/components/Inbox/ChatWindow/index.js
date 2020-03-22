import React, { PureComponent } from "react";
import ChatHeader from "./ChatHeader";
import AdManager from "../../common/Ad";
import ChatContent from "./ChatContent";
import ChatPanel from "./ChatPanel";

class ChatWindow extends PureComponent {
  state = {
    loading: false,
    cursor: null,
    hasMoreItems: true,
    limit: parseInt(process.env.REACT_APP_INBOXMSG_LIMIT),
    overlay: false
  };

  setValue = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  toggleOverlay = () => {
    this.setState({ overlay: !this.state.overlay });
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
      fetchMore,
      ReactGA,
      subscribeToMore,
      handlePreview
    } = this.props;

    if (currentChat !== null) {
      sessionStorage.setItem("pid", currentChat.id);
    } else {
      sessionStorage.setItem("pid", null);
    }
    let chatWinStyle = chatOpen ? "chat show" : "chat";
    if (this.state.overlay) {
      chatWinStyle += " overlay";
    }
    return (
      <div className="col-md-8 col-lg-9 col-xl-7">
        {currentChat !== null ? (
          <div className={chatWinStyle}>
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
              limit={parseInt(process.env.REACT_APP_INBOXMSG_LIMIT)}
              dayjs={dayjs}
              lang={lang}
              messages={currentChat.messages}
              typingText={currentChat.typingText}
              fetchMore={fetchMore}
              subscribeToMore={subscribeToMore}
              handlePreview={handlePreview}
            />
            <ChatPanel
              chatID={currentChat.id}
              t={t}
              ErrorHandler={ErrorHandler}
              toggleOverlay={this.toggleOverlay}
              isEmailOK={currentuser.isEmailOK}
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
