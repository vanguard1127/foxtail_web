/* eslint-disable jsx-a11y/alt-text */
import React, { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import Linkify from "react-linkify";
import dayjs from 'dayjs';
import { WithT } from "i18next";

import NoProfileImg from "assets/img/elements/no-profile.png";

interface IMessageProps extends WithT {
  message: any,
  currentUserID: string,
  lang: string,
  handlePreview?: (e: any) => void,
}

const Message: React.FC<IMessageProps> = forwardRef(({
  message,
  currentUserID,
  lang,
  handlePreview,
  t,
}, ref) => {

  const messageText =
    message.type === "msg" || message.type === "img"
      ? message.text
      : `${message.fromUser.username}` + t("leftchat");

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer nofollow"
      style={{ textDecoration: "underline" }}
    >
      {text}
    </a>
  );

  const createdAtString = dayjs(message.createdAt)
    .locale(lang)
    .format("HH:mm")
    .toString()

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
            src={message.profilePic !== "" ? message.profilePic : NoProfileImg}
            alt=""
          />
        </div>
      </NavLink>
      <div className="bubble">
        {message.type === "img" ? (
          <img
            src={messageText}
            data-fullSrc={message.fullImg}
            style={{
              maxHeight: "300px",
              maxWidth: "300px",
              cursor: "pointer"
            }}
            onClick={handlePreview}
          />
        ) : (
            <Linkify componentDecorator={componentDecorator}>
              {messageText}
            </Linkify>
          )}
      </div>
      <span className="time">
        {message.fromUser.id === currentUserID
          ? `${message.seenBy > 0 ? `Seen by ${message.seenBy},` : ""} ${createdAtString}`
          : `${message.fromUser.username},
          ${createdAtString}`}
      </span>
    </div>
  );
});

export default Message;
