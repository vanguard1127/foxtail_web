import React from 'react';
import moment from 'moment';

const ProfileInfoBox = ({ users, online, distance, t }) => {
  return (
    <div>
      <span className={online ? 'name online' : 'name'}>
        {users[0].username}
        {users[1] && '&' + users[1].username}
      </span>
      <span className="detail">
        <ul>
          <li className={'gender ' + users[0].gender}>
            {moment()
              .locale(localStorage.getItem('i18nextLng'))
              .diff(users[0].dob, 'years')}
          </li>
          {users[1] && (
            <li className={'gender ' + users[1].gender}>
              {moment()
                .locale(localStorage.getItem('i18nextLng'))
                .diff(users[1].dob, 'years')}
            </li>
          )}
          <li>
            ~ {distance} {t('mi')}
          </li>
        </ul>
      </span>
    </div>
  );
};

export default ProfileInfoBox;
