import React from "react";

const ProfileActionBtns = ({
  profile,
  setProfile,
  likeProfile,
  showMsgModal
}) => {
  return (
    <div className="function">
      <div className="btn heart">
        <span
          onClick={() => {
            likeProfile(profile);
          }}
        />
      </div>
      <div className="btn message">
        <span
          onClick={() => {
            showMsgModal(profile);
          }}
        />
      </div>
    </div>
  );
};

export default ProfileActionBtns;
