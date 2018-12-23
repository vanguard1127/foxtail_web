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
          onClick={async () => {
            await setProfile(profile);
            await likeProfile();
          }}
        />
      </div>
      <div className="btn message">
        <a
          href={null}
          onClick={async () => {
            await setProfile(profile);
            await showMsgModal();
          }}
        />
      </div>
    </div>
  );
};

export default ProfileActionBtns;
