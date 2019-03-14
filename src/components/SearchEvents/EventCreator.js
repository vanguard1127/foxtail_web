import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { preventContextMenu } from '../../utils/image';

class EventCreator extends PureComponent {
  render() {
    const { ownerProfile, history } = this.props;
    return (
      <div className="created">
        <span onClick={() => history.push('/member/' + ownerProfile.id)}>
          <span className="avatar">
            <img
              src={
                ownerProfile.profilePic !== ''
                  ? ownerProfile.profilePic
                  : 'assets/img/usr/avatar/1002@2x.png'
              }
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <span className="name">{ownerProfile.profileName}</span>
        </span>
      </div>
    );
  }
}

export default withRouter(EventCreator);
