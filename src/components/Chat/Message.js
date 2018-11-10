import React from "react";
import { List, Avatar, Icon } from "antd";
import moment from "moment";

const Message = ({ message }) => (
  <List.Item>
    <List.Item.Meta
      avatar={<Avatar src={message.profilePic} />}
      title={
        <a href="https://ant.design">
          {message.fromUser}
          {",  "}
          {moment(message.createdAt)
            .format("MMM Do")
            .toString()}
        </a>
      }
      description={message.text}
    />
    <div>
      <Icon type="ellipsis" theme="outlined" />
    </div>
  </List.Item>
);

export default Message;
