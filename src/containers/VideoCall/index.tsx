import React, { useEffect } from "react";
import { useMutation, useSubscription } from "react-apollo";
import { LEAVE_VIDEO_CHAT, INCOMING_VIDEO_CHAT } from "queries";
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

  const { data, loading } = useSubscription(INCOMING_VIDEO_CHAT, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log(subscriptionData);
    }
  });

  const rn =
    data && data.incomingVideoChat ? incomingVideoChat.rn : match.params.rn;

  const p =
    data && data.incomingVideoChat ? incomingVideoChat.p : match.params.p;
  if (data && data.incomingVideoChat) {
    console.log("jklkl", data.incomingVideoChat);
  }
  if (rn === "null" || loading) {
    return <div className="video-call">Loading</div>;
  }
  return (
    <div className="video-call">
      <Jitsi
        roomName={rn}
        domain={"meet.foxtailapp.com"}
        displayName={match.params.n}
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
