import React, { PureComponent } from 'react';
import MembersDropdown from '../common/MembersDropdown/MembersDropdown';
class EventShare extends PureComponent {
  state = { invDropOpen: false };
  closeInvDropdown = () => this.setState({ invDropOpen: false });
  render() {
    const { id, t } = this.props;
    const { invDropOpen } = this.state;
    return (
      <div className="share-event">
        <span className="title">{t('share')}:</span>
        <ul>
          <li className="facebook">
            <span />
          </li>
          <li className="twitter">
            <span />
          </li>
          <li className="mail">
            <span
              onClick={() => this.setState({ invDropOpen: !invDropOpen })}
            />
          </li>
        </ul>
        {invDropOpen && (
          <MembersDropdown
            targetID={id}
            targetType={'event'}
            listType={'friends'}
            t={t}
            close={this.closeInvDropdown}
          />
        )}
      </div>
    );
  }
}

export default EventShare;
