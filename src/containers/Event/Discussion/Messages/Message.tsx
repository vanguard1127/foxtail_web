import React, { forwardRef } from "react";
import Linkify from "react-linkify";

import NoProfileImg from "assets/img/elements/no-profile.png";

interface IMessageProps {
  message: any;
  history: any;
  dayjs: any;
  lang: string;
}

const Message: React.FC<IMessageProps> = forwardRef(
  ({ message, history, dayjs, lang }, ref) => {
    const messageText = message.text;

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

    const goToProfile = () => {
      history.push("/member/" + message.fromUser.profile.id);
    };

    return (
      <div className="item" ref={ref}>
        <span className="avatar">
          <span onClick={goToProfile}>
            <img
              src={
                message.profilePic !== "" ? message.profilePic : NoProfileImg
              }
              alt=""
            />
          </span>
        </span>
        <div className="info">
          <span
            className={message.blackMember ? "name blk" : "name"}
            title={message.fromUser.username}
          >
            <span onClick={goToProfile}>{message.fromUser.username}</span>
          </span>
          <span className="date">
            {dayjs(message.createdAt)
              .locale(lang)
              .format("MMMM D, YYYY - HH:mm")
              .toString()}
          </span>

          <span className="msg">
            <Linkify componentDecorator={componentDecorator}>
              {messageText}
            </Linkify>
          </span>
        </div>
      </div>
    );
  }
);

export default Message;
