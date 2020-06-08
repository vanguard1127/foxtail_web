import React, { memo, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";
import { useMutation } from "react-apollo";

import openPopupWindow from "utils/openPopupWindow";
import { ENTER_VIDEO_QUEUE } from "queries";
import { IUser } from "types/user";

interface IInboxListProps extends WithT {
  fetchData: () => void;
  openChat: (chatID: any) => void;
  currentuser: IUser;
}

const InboxList: React.FC<IInboxListProps> = memo(
  ({ fetchData, openChat, currentuser, t }) => {
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

    return (
      <div className="conversations">
        <div className="item unread">
          <span onClick={() => console.log("EEE")} className="inbox-item">
            <div className="data">
              <span className="name" title={"Global Chat"}>
                {"Global Chat"}
              </span>
              <span className={"msg new"}>Members: 340</span>
            </div>
          </span>
        </div>
        <div className="item unread">
          <span onClick={() => console.log("EEE")} className="inbox-item">
            <div className="data">
              <span className="name" title={"San Diego Chat"}>
                {"San Diego Chat"}
              </span>
              <span className={"msg new"}>Members: 23</span>
            </div>
          </span>
        </div>
        <div className="item unread">
          <span onClick={() => videoCallHandler()} className="inbox-item">
            <div className="data">
              <span className="name" title={"Foxtail Meet"}>
                {"Foxtail Meet"}
              </span>
              <span className={"msg new"}>Members: 23</span>
            </div>
          </span>
        </div>
        <div className="item">
          <Waypoint
            onEnter={({ previousPosition }) => handleEnd(previousPosition)}
          />
        </div>
      </div>
    );
  }
);

export default InboxList;
