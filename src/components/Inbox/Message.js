import React from "react";
import moment from "moment";

const Message = React.forwardRef(({ message, currentUserID }, ref, t) => {
  const messageText =
    message.type === "msg"
      ? message.text
      : `${message.fromUser.username}` + t("leftchat");

  return (
    <div
      className={
        message.fromUser.id === currentUserID ? "msg-item response" : "msg-item"
      }
      ref={ref}
    >
      <div className="avatar">
        <img
          src={
            message.profilePic !== ""
              ? message.profilePic
              : "assets/img/usr/avatar/1001@2x.png"
          }
          alt=""
        />
      </div>
      <div className="bubble">
        {messageText}
        {message.fromUser.username}
      </div>
      <span className="time">
        {" "}
        {moment(message.createdAt)
          .format("MMM Do")
          .toString()}
      </span>
    </div>
  );
});

export default Message;
