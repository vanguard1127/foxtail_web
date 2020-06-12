import React, { useEffect, useState } from "react";
import { useMutation, useSubscription } from "react-apollo";
import Jitsi from "react-jitsi";

import {
  LEAVE_VIDEO_CHAT,
  INCOMING_VIDEO_CHAT,
  EXIT_VIDEO_QUEUE
} from "queries";

import "./VideoCall.scss";

const VideoCall = ({ match, chatID }) => {
  const [roomCredentials, setRoomCredentials] = useState({
    rn: match.params.rn,
    p: match.params.p
  });

  const [exitVideoQueue] = useMutation(EXIT_VIDEO_QUEUE);
  const [leaveVideoChat] = useMutation(LEAVE_VIDEO_CHAT, {
    variables: { chatID }
  });
  useEffect(() => {
    return function cleanup() {
      if (chatID) {
        leaveVideoChat();
      } else {
        exitVideoQueue();
      }
    };
  });

  useSubscription(INCOMING_VIDEO_CHAT, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data.incomingVideoChat !== null) {
        setRoomCredentials({
          rn: subscriptionData.data.incomingVideoChat.rn,
          p: subscriptionData.data.incomingVideoChat.p
        });
        //TODO: How do we force it to update
      }
    }
  });
  const { rn, p } = roomCredentials;
  console.log("R", rn, "p", p);
  return (
    <div className="video-call">
      <Jitsi
        roomName={rn}
        domain={"meet.foxtailapp.com"}
        displayName={p}
        password={p}
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
