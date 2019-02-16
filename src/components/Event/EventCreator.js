import React from 'react';
import moment from 'moment';
import { preventContextMenu } from '../../utils/image';
const EventCreator = ({ ownerProfile, createdAt, history, t }) => {
  return (
    <div className="created">
      <span onClick={() => history.push('/member/' + ownerProfile.id)}>
        <span className="avatar">
          <img
            src={
              ownerProfile.profilePic !== ''
                ? ownerProfile.profilePic
                : '/assets/img/usr/avatar/1003@2x.png'
            }
            alt=""
            onContextMenu={preventContextMenu}
          />
        </span>
        <div className="detail">
          <span className="name">{ownerProfile.profileName}</span>
          <span className="created-date">
            {t('createdon')}{' '}
            {moment(createdAt)
              .locale(localStorage.getItem('i18nextLng'))
              .format('MMM Do')
              .toString()}
          </span>
        </div>
      </span>
    </div>
  );
};

export default EventCreator;
