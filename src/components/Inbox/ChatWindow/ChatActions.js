import React, { Component } from "react";
import MembersDropdown from "../../common/MembersDropdown/MembersDropdown";
class ChatActions extends Component {
  state = { invDropOpen: false, remDropOpen: false };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.invDropOpen !== nextState.invDropOpen ||
      this.state.remDropOpen !== nextState.remDropOpen ||
      this.props.t !== nextProps.t ||
      this.props.participantsNum !== nextProps.participantsNum
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
      leaveDialog,
      ReactGA,
      participantsNum
    } = this.props;

    const { invDropOpen, remDropOpen } = this.state;

    return (
      <ul>
        <li
          className="members"
          onClick={() => this.setState({ remDropOpen: !remDropOpen })}
        >
          <span>
            {t("common:Participants") + " (" + participantsNum + ") "}
          </span>
        </li>
        {remDropOpen && (
          <MembersDropdown
            targetID={chatID}
            targetType={"chat"}
            listType={"participants"}
            t={t}
            close={this.closeRemDropdown}
            isOwner={isOwner}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
        <li
          className="invite"
          onClick={() => this.setState({ invDropOpen: !invDropOpen })}
        >
          <span>{t("invitemem")}</span>
        </li>
        {invDropOpen && (
          <MembersDropdown
            targetID={chatID}
            targetType={"chat"}
            listType={"friends"}
            t={t}
            close={this.closeInvDropdown}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
        )}
        <li className="leave" onClick={leaveDialog}>
          <span>{t("leaveconv")}</span>
        </li>{" "}
        <li className="report" onClick={setBlockModalVisible}>
          <span>{t("reportconv")}</span>
        </li>
      </ul>
    );
  }
}

export default ChatActions;
