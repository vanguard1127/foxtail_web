import React from "react";
import { NavLink } from "react-router-dom";
import NoProfileImg from "../../../../assets/img/elements/no-profile.png";

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
        <NavLink to={"/member/" + message.fromUser.profile.id}>
          <div className="avatar" title={message.fromUser.username}>
            <img
              src={
                message.profilePic !== "" ? message.profilePic : NoProfileImg
              }
              alt=""
            />
          </div>
        </NavLink>
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
