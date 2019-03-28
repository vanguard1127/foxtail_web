import React, { PureComponent } from "react";
import TimeAgo from "../../utils/TimeAgo";
import ChatActions from "./ChatActions";
class ChatHeader extends PureComponent {
  state = { open: false };
  toggleMenu = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    const {
      currentChat,
      currentuser,
      t,
      chatID,
      setBlockModalVisible,
      isOwner,
      ErrorHandler,
      leaveDialog,
      handleRemoveSelf
    } = this.props;

    const { open } = this.state;
    let chatTitle = t("nothere");
    let chatLastSeen = "";
    let chatTitleExtra = "";
    let chatProfilePic = "";

    if (currentChat) {
      let notME = currentChat.participants.filter(
        el => el.id.toString() !== currentuser.profileID
      );

      if (notME.length > 0) {
        chatTitle = notME[0].profileName;
        chatProfilePic = notME[0].profilePic;
      } else {
        chatTitle = currentuser.username;
        chatProfilePic = currentChat.participants[0].profilePic;
      }

      if (currentChat.participants.length > 2) {
        chatTitleExtra =
          ` + ${currentChat.participants.length - 2}` + t("participants");
      }

      chatLastSeen = currentChat.participants[0].online
        ? t("common:Online")
        : TimeAgo(currentChat.participants[0].updatedAt);
    }
    return (
      <div className="navbar">
        <div className="user">
          <div className="avatar">
            <span>
              <img src={chatProfilePic} alt="" />
            </span>
          </div>
          <span className="name couple">
            <span>
              {chatTitle}
              {chatTitleExtra}
            </span>
          </span>
          <span className="last-seen online">{chatLastSeen}</span>
        </div>
        <div className="more" onClick={this.toggleMenu} />
        <div className={open ? "more-dropdown open" : "more-dropdown"}>
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
    );
  }
}

export default ChatHeader;
