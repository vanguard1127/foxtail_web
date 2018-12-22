import React from "react";
import { List, Avatar, Icon } from "antd";
import moment from "moment";

const Message = React.forwardRef(({ message }, ref) => {
  const messageText =
    message.type === "msg"
      ? message.text
      : `${message.fromUser.username} has left the chat`;

  return (
    <div ref={ref}>
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={message.profilePic} />}
          title={
            <a href="https://ant.design">
              {message.fromUser.username}
              {",  "}
              {moment(message.createdAt)
                .format("MMM Do")
                .toString()}
            </a>
          }
          description={messageText}
        />
        <div>
          <Icon type="ellipsis" theme="outlined" />
        </div>
      </List.Item>
    </div>
  );
});

export default Message;
