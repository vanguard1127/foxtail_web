import React from "react";
const ProfileActions = ({ profile, setProfile, likeProfile, showMsgModal }) => {
  return (
    <div className="functions">
      <div className="btn send-msg">
        <span
          onClick={async () => {
            await setProfile(profile);
            await showMsgModal();
          }}
        >
          Send Message
        </span>
      </div>
      <div className="btn heart">
        <span
          onClick={async () => {
            await setProfile(profile);
            await likeProfile();
          }}
        />
      </div>
    </div>
  );
};

export default ProfileActions;
