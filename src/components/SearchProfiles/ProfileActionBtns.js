import React from "react";

const ProfileActionBtns = ({
  profile,
  setProfile,
  likeProfile,
  showMsgModal
}) => {
  return (
    <div className="function">
      <div
        className="btn heart"
        onClick={() => {
          likeProfile(profile);
        }}
      />
      <div
        className="btn message"
        onClick={() => {
          showMsgModal(profile);
        }}
      />
    </div>
  );
};

export default ProfileActionBtns;
