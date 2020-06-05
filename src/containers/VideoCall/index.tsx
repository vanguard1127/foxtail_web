import React from "react";
import Jitsi from "react-jitsi";

import "./VideoCall.scss";

const VideoCall = ({ match }) => {
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
