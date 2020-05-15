import React from "react";
import { WithT } from "i18next";

interface IProfileActionsProps extends WithT {
  likeProfile: () => void;
  showMsgModal: () => void;
  liked: boolean;
  msgd: boolean;
}

const ProfileActions: React.FC<IProfileActionsProps> = ({
  likeProfile,
  showMsgModal,
  liked,
  msgd,
  t,
}) => {
  return (
    <div className="functions">
      {!msgd && (
        <React.Fragment>
          <div className="btn send-msg" onClick={showMsgModal}>
            {t("common:sendmsg")}
          </div>
          <div
            className={liked ? "btn heart unheart" : "btn heart"}
            onClick={likeProfile}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default ProfileActions;
