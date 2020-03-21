import React from "react";
import { NavLink } from "react-router-dom";
import NoProfileImg from "../../../../assets/img/elements/no-profile.png";

const Message = React.forwardRef(
  ({ message, currentUserID, t, dayjs, lang }, ref) => {
    const messageText =
      message.type === "msg" || message.type === "img"
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
        <div className="bubble">
          {message.type === "img" ? (
            <img
              src={messageText}
              style={{ maxHeight: "300px", maxWidth: "300px" }}
            />
          ) : (
            messageText
          )}
        </div>
        <span className="time">
          {message.fromUser.id === currentUserID
            ? `${
                message.seenBy > 0 ? `Seen by ${message.seenBy},` : ""
              } ${dayjs(message.createdAt)
                .locale(lang)
                .format("HH:mm")
                .toString()}`
            : `${message.fromUser.username},
          ${dayjs(message.createdAt)
            .locale(lang)
            .format("HH:mm")
            .toString()}`}
        </span>
      </div>
    );
  }
);

export default Message;
