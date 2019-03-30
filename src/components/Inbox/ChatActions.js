import React, { Component } from "react";
import MembersDropdown from "../common/MembersDropdown/MembersDropdown";
class ChatActions extends Component {
  state = { invDropOpen: false, remDropOpen: false };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.invDropOpen !== nextState.invDropOpen ||
      this.state.remDropOpen !== nextState.remDropOpen
    ) {
      return true;
    }
    return false;
  }
  closeRemDropdown = () => this.setState({ remDropOpen: false });
  closeInvDropdown = () => this.setState({ invDropOpen: false });
  render() {
    const {
      chatID,
      t,
      setBlockModalVisible,
      isOwner,
      ErrorHandler,
      leaveDialog
    } = this.props;

    const { invDropOpen, remDropOpen } = this.state;
    return (
      <ul>
        <li className="members">
          <span onClick={() => this.setState({ remDropOpen: !remDropOpen })}>
            Participants
          </span>
        </li>{" "}
        {remDropOpen && (
          <MembersDropdown
            targetID={chatID}
            targetType={"chat"}
            listType={"participants"}
            t={t}
            close={this.closeRemDropdown}
            isOwner={isOwner}
            ErrorHandler={ErrorHandler}
          />
        )}
        <li className="invite">
          <span onClick={() => this.setState({ invDropOpen: !invDropOpen })}>
            Invite Members
          </span>
        </li>{" "}
        {invDropOpen && (
          <MembersDropdown
            targetID={chatID}
            targetType={"chat"}
            listType={"friends"}
            t={t}
            close={this.closeInvDropdown}
            style={{ top: "90px" }}
            ErrorHandler={ErrorHandler}
          />
        )}
        <li className="leave">
          <span onClick={leaveDialog}>{t("leaveconv")}</span>
        </li>{" "}
        <li className="report">
          <span onClick={setBlockModalVisible}>{t("reportconv")}</span>
        </li>
      </ul>
    );
  }
}

export default ChatActions;
