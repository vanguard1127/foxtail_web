import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { BLOCK_PROFILE, FLAG_ITEM } from '../../../queries';
import { Mutation } from 'react-apollo';

class InvitationModal extends Component {
  state = { other: false, reason: '', type: this.props.type };

  render() {
    return (
      <div className="invite-member">
        <div className="content">
          <div className="head">Invite Members</div>
          <div className="inv-item">
            <div className="select-checkbox">
              <input type="checkbox" id="cbox" checked="" />
              <label for="cbox">
                <span />
              </label>
            </div>
            <div className="avatar">
              <a href="#">
                <img src="assets/img/usr/avatar/1001@2x.png" alt="" />
              </a>
            </div>
            <span className="username">Chris</span>
          </div>
          <div className="inv-item">
            <div className="select-checkbox">
              <input type="checkbox" id="cbox" checked="" />
              <label for="cbox">
                <span />
              </label>
            </div>
            <div className="avatar">
              <a href="#">
                <img src="assets/img/usr/avatar/1004@2x.png" alt="" />
              </a>
            </div>
            <span className="username">Meggie</span>
          </div>
          <div className="apply-content">
            <span>Invite</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces('modals')(InvitationModal);
