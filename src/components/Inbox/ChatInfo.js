import React, { Component } from 'react';
import MembersDropdown from '../common/MembersDropdown/MembersDropdown';
class ChatInfo extends Component {
  state = { invDropOpen: false, remDropOpen: false };
  //TODO: Test if this prevent new messages from getting shown
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
      handleRemoveSelf,
      isOwner,
      ErrorHandler
    } = this.props;

    const { invDropOpen, remDropOpen } = this.state;
    return (
      <div className="col-xl-2">
        <div className="right">
          <div className="head" />
          <div className="content">
            <div className="visit-profile">
              <span>{t('visit')}</span>
            </div>
            <div className="functions">
              {remDropOpen && (
                <MembersDropdown
                  targetID={chatID}
                  targetType={'chat'}
                  listType={'participants'}
                  t={t}
                  close={this.closeRemDropdown}
                  isOwner={isOwner}
                  ErrorHandler={ErrorHandler}
                />
              )}
              <ul>
                <li className="report">
                  <span
                    onClick={() => this.setState({ remDropOpen: !remDropOpen })}
                  >
                    Participants
                  </span>
                </li>
                <li className="report">
                  <span
                    onClick={() => this.setState({ invDropOpen: !invDropOpen })}
                  >
                    Invite Members
                  </span>
                </li>{' '}
                {invDropOpen && (
                  <MembersDropdown
                    targetID={chatID}
                    targetType={'chat'}
                    listType={'friends'}
                    t={t}
                    close={this.closeInvDropdown}
                    style={{ top: '90px' }}
                    ErrorHandler={ErrorHandler}
                  />
                )}
                <li className="delete">
                  <span onClick={handleRemoveSelf}>{t('leaveconv')}</span>
                </li>{' '}
                <li className="report">
                  <span onClick={setBlockModalVisible}>{t('reportconv')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatInfo;
