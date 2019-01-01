import React from "react";
import moment from "moment";

const Message = React.forwardRef(({ message }, ref) => {
  const messageText = message.text;
  return (
    <div className="item" ref={ref}>
      <span className="avatar">
        <a href="#">
          <img
            src={
              message.profilePic !== ""
                ? message.profilePic
                : "/assets/img/usr/avatar/1001@2x.png"
            }
            alt=""
          />
        </a>
      </span>
      <div className="info">
        <span className="name">
          <a href="#"> {message.fromUser.username}</a>
        </span>
        <span className="date">
          {" "}
          {moment(message.createdAt)
            .format("MMMM D, YYYY - HH:mm")
            .toString()}
        </span>

        <span className="msg">{messageText}</span>
      </div>
    </div>
  );
});

export default Message;
