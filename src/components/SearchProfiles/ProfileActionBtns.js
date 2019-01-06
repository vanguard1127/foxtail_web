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
        <a
          href={null}
          onClick={() => {
            likeProfile(profile);
          }}
        />
      </div>
      <div className="btn message">
        <a
          href={null}
          onClick={() => {
            showMsgModal(profile);
          }}
        />
      </div>
    </div>
  );
};

export default ProfileActionBtns;
