import React from 'react';
import NoticesList from './NoticesList';
import Menu from '../common/Menu';
const NoticesItem = ({ count }) => {
  return (
    <Menu
      activeStyle="notification active"
      notActiveStyle={count > 0 ? 'notification active' : 'notification'}
      menuOpener={
        <span className="icon alert">
          {count > 0 && <span className="count">{count}</span>}
        </span>
      }
    >
      <NoticesList />
    </Menu>
  );
};

export default NoticesItem;
