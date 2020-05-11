import React, { memo } from "react";
import { WithT } from "i18next";

interface IProfileActionBtnsProps extends WithT {
  profile: any;
  likeProfile: (profile: any) => void;
  showMsgModal: (profile: any) => void;
  liked: boolean;
  msgd: boolean;
  featured?: boolean;
}

const ProfileActionBtns: React.FC<IProfileActionBtnsProps> = memo(({
  profile,
  likeProfile,
  showMsgModal,
  liked,
  msgd,
  featured = false,
  t,
}) => {
  return (
    <div className="function">
      {
        liked && featured ? (
          <div className="btn sent">{t("common:matched")}</div>
        ) :
          !msgd ? (
            <React.Fragment>
              <div
                className={liked ? "btn unheart" : "btn heart"}
                onClick={() => { likeProfile(profile); }}
              />
              <div
                className="btn message"
                onClick={() => { showMsgModal(profile); }}
              />
            </React.Fragment>
          ) :
            <div className="btn sent">{t("common:msgsent")}</div>
      }
    </div>
  )
});

export default ProfileActionBtns;
