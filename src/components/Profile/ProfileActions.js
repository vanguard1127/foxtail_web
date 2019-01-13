import React from "react";
const ProfileActions = ({
  profile,
  setProfile,
  likeProfile,
  showMsgModal,
  t
}) => {
  return (
    <div className="functions">
      <div
        className="btn send-msg"
        onClick={async () => {
          await setProfile(profile);
          await showMsgModal();
        }}
      >
        {t("Send Message")}
      </div>
      <div
        className="btn heart"
        onClick={async () => {
          await setProfile(profile);
          await likeProfile();
        }}
      />
    </div>
  );
};

export default ProfileActions;
