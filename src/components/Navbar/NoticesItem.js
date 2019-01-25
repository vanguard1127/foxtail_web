import React from "react";
import NoticesList from "./NoticesList";
import Menu from "../common/Menu";
const NoticesItem = ({ count }) => {
  return (
    <Menu
      activeStyle="notification active"
      notActiveStyle="notification"
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
