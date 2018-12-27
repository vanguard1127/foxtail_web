import React from "react";
const ProfileActions = ({ profile, setProfile, likeProfile, showMsgModal }) => {
  return (
    <div className="functions">
      <div className="btn send-msg">
        <a
          href="#"
          onClick={async () => {
            await setProfile(profile);
            await showMsgModal();
          }}
        >
          Send Message
        </a>
      </div>
      <div className="btn heart">
        <a
          href="#"
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
