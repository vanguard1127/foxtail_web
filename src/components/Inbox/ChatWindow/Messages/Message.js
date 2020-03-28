import React from "react";
import { NavLink } from "react-router-dom";
import Linkify from "react-linkify";
import NoProfileImg from "../../../../assets/img/elements/no-profile.png";

const Message = React.forwardRef(
  ({ message, currentUserID, t, dayjs, lang, handlePreview }, ref) => {
    const messageText =
      message.type === "msg" || message.type === "img"
        ? message.text
        : `${message.fromUser.username}` + t("leftchat");
    const componentDecorator = (href, text, key) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer nofollow" style={{ textDecoration: "underline" }}>
        {text}
      </a>
    );
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
              style={{
                maxHeight: "300px",
                maxWidth: "300px",
                cursor: "pointer"
              }}
              onClick={handlePreview}
              alt="image"
            />
          ) : (
                    <Linkify componentDecorator={componentDecorator}>
              {messageText}
            </Linkify>
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
