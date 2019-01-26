import React from "react";
import moment from "moment";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
const Message = React.forwardRef(({ message, currentUserID, t }, ref) => {
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
          onContextMenu={preventContextMenu}
        />
      </div>
      <div className="bubble">{messageText}</div>
      <span className="time">
        {" "}
        {message.fromUser.username},{" "}
        {moment(message.createdAt)
          .format("HH:mm")
          .toString()}
      </span>
    </div>
  );
});

export default Message;
