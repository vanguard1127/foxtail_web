import React, { PureComponent } from "react";
import TimeAgo from "../../../utils/TimeAgo";
import ChatActions from "./ChatActions";
import { NavLink } from "react-router-dom";
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
      handleRemoveSelf,
      ReactGA
    } = this.props;

    const { open } = this.state;
    let chatTitle = t("nothere");
    let chatLastSeen = "";
    let chatTitleExtra = "";
    let chatProfilePic = "";
    let chatProfileID = "";

    if (currentChat) {
      let notME = currentChat.participants.filter(
        el => el.id.toString() !== currentuser.profileID
      );

      if (notME.length > 0) {
        chatTitle = notME[0].profileName;
        chatProfilePic = notME[0].profilePic;
        chatProfileID = notME[0].id;
        if (notME[0].showOnline) {
          chatLastSeen = notME[0].online
            ? t("common:Online")
            : TimeAgo(notME[0].updatedAt);
        } else {
          chatLastSeen = "N/A";
        }
      } else {
        chatTitle = currentuser.username;
        chatProfilePic = currentChat.participants[0].profilePic;
        if (currentChat.participants[0].showOnline) {
          chatLastSeen = currentChat.participants[0].online
            ? t("common:Online")
            : TimeAgo(currentChat.participants[0].updatedAt);
        } else {
          chatLastSeen = "N/A";
        }
      }

      if (currentChat.participants.length > 2) {
        chatTitleExtra = ` +${currentChat.participants.length - 2}`;
      }
    }

    return (
      <div className="navbar">
        <div className="user">
          <NavLink to={"/member/" + chatProfileID}>
            <div className="avatar">
              <span>
                <img src={chatProfilePic} alt="" />
              </span>
            </div>
            <span className="name">
              <span>
                {chatTitle}
                &nbsp; {chatTitleExtra}
              </span>
            </span>
            {chatLastSeen !== "N/A" && (
              <span className="last-seen online">{chatLastSeen}</span>
            )}
          </NavLink>
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
            ReactGA={ReactGA}
            participantsNum={currentChat.participants.length}
          />
        </div>
      </div>
    );
  }
}

export default ChatHeader;
