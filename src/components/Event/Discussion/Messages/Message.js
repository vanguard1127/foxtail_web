import React from "react";
import { preventContextMenu } from "../../../../utils/image";
const NoProfileImg = require("../../../../assets/img/elements/no-profile.png");
const Message = React.forwardRef(({ message, history, dayjs, lang }, ref) => {
  const messageText = message.text;
  return (
    <div className="item" ref={ref}>
      <span className="avatar">
        <span
          onClick={() => history.push("/member/" + message.fromUser.profile.id)}
        >
          <img
            src={message.profilePic !== "" ? message.profilePic : NoProfileImg}
            alt=""
            onContextMenu={preventContextMenu}
          />
        </span>
      </span>
      <div className="info">
        <span className={message.blackMember?"name blk":"name"} title={message.fromUser.username}>
          <span
            onClick={() =>
              history.push("/member/" + message.fromUser.profile.id)
            }
          >
            {message.fromUser.username}
          </span>

        </span>
        <span className="date">
          {" "}
          {dayjs(message.createdAt)
            .locale(lang)
            .format("MMMM D, YYYY - HH:mm")
            .toString()}
        </span>

        <span className="msg">{messageText}</span>
      </div>
    </div>
  );
});

export default Message;
