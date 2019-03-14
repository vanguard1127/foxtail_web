import React, { PureComponent } from 'react';
import MembersDropdown from '../common/MembersDropdown/MembersDropdown';
class ChatInfo extends PureComponent {
  state = { invDropOpen: false, remDropOpen: false };
  render() {
    const {
      chatID,
      t,
      setBlockModalVisible,
      handleRemoveSelf,
      isOwner
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
                  close={() => this.setState({ remDropOpen: false })}
                  isOwner={isOwner}
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
                    close={() => this.setState({ invDropOpen: false })}
                    style={{ top: '90px' }}
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
