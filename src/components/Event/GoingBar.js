import React, { Component } from 'react';
import MembersDropdown from '../common/MembersDropdown/MembersDropdown';
class GoingBar extends Component {
  state = { remDropOpen: false };
  render() {
    const { id, participants, t, isOwner } = this.props;
    const { remDropOpen } = this.state;
    return (
      <div className="goings">
        <span className="stats">
          <div
            className="content"
            onClick={() => this.setState({ remDropOpen: !remDropOpen })}
          >
            <ul>
              <li>
                <img src="/assets/img/usr/avatar/1001@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1002@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1003@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1004@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1005@2x.png" alt="" />
              </li>
              <li>
                <img src="/assets/img/usr/avatar/1006@2x.png" alt="" />
              </li>
            </ul>
            <span className="stats">
              <b>
                {participants.length} {t('common:people')}
              </b>{' '}
              {t('common:going')}
            </span>
          </div>
          {remDropOpen && (
            <MembersDropdown
              targetID={id}
              targetType={'event'}
              listType={'participants'}
              isOwner={isOwner}
              t={t}
              close={() => this.setState({ remDropOpen: false })}
            />
          )}
        </span>
      </div>
    );
  }
}

export default GoingBar;
