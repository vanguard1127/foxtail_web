import React, { memo, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";
import { useMutation } from "react-apollo";

import openPopupWindow from "utils/openPopupWindow";
import { ENTER_VIDEO_QUEUE } from "queries";
import { IUser } from "types/user";
import NoProfileImg from "assets/img/elements/no-profile.png";

interface IPartyListProps extends WithT {
  fetchData: () => void;
  openChat: (chatID: any) => void;
  currentuser: IUser;
  chatrooms: any;
}

const PartyList: React.FC<IPartyListProps> = memo(
  ({ fetchData, openChat, currentuser, t, chatrooms }) => {
    const handleEnd = (previousPosition) => {
      if (previousPosition === Waypoint.below) {
        fetchData();
      }
    };
    const [enterVideoQueue] = useMutation(ENTER_VIDEO_QUEUE);

    const videoCallHandler = () => {
      enterVideoQueue().then(() => {
        openPopupWindow(
          `http://localhost:1234/videocall/null/null/null`,
          "VideoCall",
          window,
          700,
          402
        );
      });
    };

    const renderItem = (item) => {
      const title = item.name;

      return (
        <div className="item unread" key={item.id}>
          <span onClick={() => openChat(item.id)} className="inbox-item">
            <span className="img">
              <img src={NoProfileImg} alt="" />
            </span>
            <div className="data">
              <span className="name" title={title}>
                {title}
              </span>
              <span className={"time blk"} />
              <span className={"msg new"}>Members: {item.numParticipants}</span>
            </div>
          </span>
        </div>
      );
    };

    const renderMsgList = ({ chatrooms }) => {
      if (chatrooms.length === 0) {
        return <span className="no-message">{t("nomsgsInbox")}</span>;
      }

      return (
        <>
          {chatrooms.map((chatroom) => {
            return renderItem(chatroom);
          })}
        </>
      );
    };

    return (
      <>
        <div className="title">Chatrooms</div>
        <div className="conversations">
          {renderMsgList({ chatrooms })}
          <div className="item">
            <Waypoint
              onEnter={({ previousPosition }) => handleEnd(previousPosition)}
            />
          </div>
        </div>
      </>
    );
  }
);

export default PartyList;
