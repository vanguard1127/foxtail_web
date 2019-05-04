import React from "react";
import { preventContextMenu } from "../../../../utils/image";

const Message = React.forwardRef(
  ({ message, currentUserID, t, dayjs, lang }, ref) => {
    const messageText =
      message.type === "msg"
        ? message.text
        : `${message.fromUser.username}` + t("leftchat");

    return (
      <div
        className={
          message.fromUser.id === currentUserID
            ? "msg-item response"
            : "msg-item"
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
          {dayjs(message.createdAt)
            .locale(lang)
            .format("HH:mm")
            .toString()}
        </span>
      </div>
    );
  }
);

export default Message;
