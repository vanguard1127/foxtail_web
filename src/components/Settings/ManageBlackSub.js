import React, { Component } from 'react';
import UpdateSubBtn from './UpdateSubBtn';
import CancelSubBtn from './CancelSubBtn';
import moment from 'moment';

class ManageBlackSub extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    const { refetchUser, ErrorHandler, t, currentuser } = this.props;
    return (
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">
              {t('ManageBlackSub')} <i>- ({t('vertitle')})</i>
            </span>
          </div>
          {currentuser.ccLast4 && (
            <div className="col-md-12">
              {t('common:creditend')} {currentuser.ccLast4}{' '}
              {t('common:renewdate')}:{' '}
              {moment(currentuser.blackMember.renewalDate)
                .locale(localStorage.getItem('i18nextLng'))
                .format('MMMM DD YYYY')}
            </div>
          )}
          {!currentuser.ccLast4 && (
            <div className="col-md-12">
              {t('common:blkend')}:{' '}
              {moment(currentuser.blackMember.renewalDate)
                .locale(localStorage.getItem('i18nextLng'))
                .format('MMMM DD YYYY')}
            </div>
          )}
          <div className="col-md-6">
            <div className="verification-box">
              <UpdateSubBtn
                refetchUser={refetchUser}
                t={t}
                ErrorHandler={ErrorHandler}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <CancelSubBtn
                refetchUser={refetchUser}
                t={t}
                ErrorHandler={ErrorHandler}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageBlackSub;
