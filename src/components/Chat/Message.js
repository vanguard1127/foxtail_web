import React from "react";
import { List, Avatar, Icon } from "antd";

const Message = ({ message }) => (
  <List.Item>
    <List.Item.Meta
      avatar={<Avatar src={message.profilePic} />}
      title={<a href="https://ant.design">{message.fromUser.username}</a>}
      description={message.text}
    />
    <div>
      <Icon type="ellipsis" theme="outlined" />
    </div>
  </List.Item>
);

export default Message;
