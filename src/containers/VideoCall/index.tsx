import React, { useEffect } from "react";
import { useMutation } from "react-apollo";
import { LEAVE_VIDEO_CHAT } from "queries";
import Jitsi from "react-jitsi";
import "./VideoCall.scss";

const VideoCall = ({ match, chatID }) => {
  const [leaveVideoChat] = useMutation(LEAVE_VIDEO_CHAT, {
    variables: { chatID }
  });
  useEffect(() => {
    return function cleanup() {
      if (chatID) {
        leaveVideoChat();
      }
    };
  });
  return (
    <div className="video-call">
      <Jitsi
        roomName={match.params.rn}
        domain={"meet.foxtailapp.com"}
        displayName={match.params.n}
        password={match.params.p}
        containerStyle={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        frameStyle={{
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
};

export default VideoCall;
