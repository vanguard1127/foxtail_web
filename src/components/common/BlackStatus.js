import React from 'react';
import moment from 'moment';
import UpdateSubBtn from './UpdateSubBtn';
import CancelSubBtn from './CancelSubBtn';

const BlackStatus = ({
  blkMemberInfo,
  ccLast4,
  visible,
  refetchUser,
  close,
  t
}) => {
  if (blkMemberInfo.active && ccLast4 === null) {
    return (
      <div>
        {t('common:thanks')}.
        <br /> {t('common:blkend')}:{' '}
        {moment(blkMemberInfo.renewalDate)
          .locale(localStorage.getItem('i18nextLng'))
          .format('MMMM DD YYYY')}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else if (blkMemberInfo.active) {
    return (
      <div>
        {t('thanks')}.
        <br /> {t('common:creditend')} {ccLast4} {t('common:renewdate')}:{' '}
        {moment(blkMemberInfo.renewalDate)
          .locale(localStorage.getItem('i18nextLng'))
          .format('MMMM DD YYYY')}
        <br />
        <UpdateSubBtn refetchUser={refetchUser} close={close} />
        <CancelSubBtn refetchUser={refetchUser} close={close} />
      </div>
    );
  } else {
    return (
      <button type="primary" htmlType="submit" onClick={visible}>
        {t('common:become')}
      </button>
    );
  }
};

export default BlackStatus;
