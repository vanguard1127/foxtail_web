import React from "react";
import Jitsi from "react-jitsi";

import './VideoCall.scss';

const VideoCall = () => {
    return (
        <div className="video-call">
            <Jitsi
                roomName={"Foxtail"}
                domain={"meet.foxtailapp.com"}
                displayName="Gary"
                password="test"
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
    )
}

export default VideoCall;