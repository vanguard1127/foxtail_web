import React, { Component } from 'react';
import moment from 'moment';

class ProfileInfo extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { users, online, t } = this.props;
    return (
      <div className={online ? 'user-info online' : 'user-info'}>
        <div>
          <span> {users[0].username + ', '} </span>
          <span>
            {' '}
            {moment()
              .locale(localStorage.getItem('i18nextLng'))
              .diff(users[0].dob, 'years')}
            ,
          </span>
          <span>{t('Bisexual')}</span>
        </div>
        {users[1] && (
          <div>
            <span>{users[1].username},</span>
            <span>
              {' '}
              {moment()
                .locale(localStorage.getItem('i18nextLng'))
                .diff(users[1].dob, 'years')}
              ,
            </span>
            <span>{t('Bisexual')}</span>
          </div>
        )}
      </div>
    );
  }
}

export default ProfileInfo;
