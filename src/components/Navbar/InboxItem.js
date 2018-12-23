import React from "react";
import { Icon, Badge } from "antd";

const InboxItem = () => {
  return (
    <div>
      <Badge count={5}>
        <Icon type="mail" />
      </Badge>
      Inbox
    </div>
  );
};

export default InboxItem;
