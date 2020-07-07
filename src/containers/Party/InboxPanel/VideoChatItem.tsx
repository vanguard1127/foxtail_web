import React, { memo, useEffect } from "react";
import { Waypoint } from "react-waypoint";
import { WithT } from "i18next";
import { useMutation } from "react-apollo";

import openPopupWindow from "utils/openPopupWindow";
import { ENTER_VIDEO_QUEUE } from "queries";

const VideoChatItem: React.FC<WithT> = memo(({ t }) => {
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
    <div className="section">
      <div className="title">Foxtail Meet</div>
      <div>
        <button onClick={() => videoCallHandler()}>Start Video Chat</button>
      </div>
    </div>
  );
});

export default VideoChatItem;
