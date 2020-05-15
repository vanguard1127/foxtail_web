import React, { useState } from "react";
import { Prompt } from "react-router-dom";

import DailyLimitModal from "components/Modals/DailyLimit";
import DirectMsgModal from "components/Modals/DirectMsg";

import ProfilePic from "./ProfilePic";
import ProfileActions from "./ProfileActions";
import { WithT } from "i18next";

interface IProfileCardProps extends WithT {
  liked: boolean;
  likesSent: number;
  ErrorHandler: any;
  isBlackMember: boolean;
  likeProfile: () => void;
  toast: any;
  msgsSent: number;
  setMsgSent: () => void;
  history: any;
  profile;
  isSelf: boolean;
  ReactGA: any;
  msgd: boolean;
  showShareModal: () => void;
  handlePreview: (e: any) => void;
}

const ProfileCard: React.FC<IProfileCardProps> = ({
  liked,
  likesSent,
  ErrorHandler,
  isBlackMember,
  likeProfile,
  toast,
  msgsSent,
  setMsgSent,
  history,
  profile,
  isSelf,
  ReactGA,
  msgd,
  showShareModal,
  handlePreview,
  t,
}) => {
  const [state, setState] = useState({
    liked,
    msgModalVisible: false,
    maxLikeDlgVisible: false
  })

  const setMaxLikeDlgVisible = () => {
    ErrorHandler.setBreadcrumb("Max Like Dialog Toggled:");
    setState({ ...state, maxLikeDlgVisible: !state.maxLikeDlgVisible });
  };

  const toggleLiked = () => {
    if (!state.liked && likesSent > 24 && !isBlackMember) {
      setMaxLikeDlgVisible();
      return;
    }
    setState({ ...state, liked: !state.liked });
    likeProfile();
  };

  const setMsgModalVisible = msgModalVisible => {
    ErrorHandler.setBreadcrumb("Message Modal Opened:" + msgModalVisible);
    if (msgsSent > 4 && msgModalVisible) {
      if (!toast.isActive("maxmsgs")) {
        toast.info(t("common:Daily Direct Message Limit Reached. *Only 5 allowed daily."), {
          position: toast.POSITION.TOP_CENTER,
          toastId: "maxmsgs"
        });
      }
      return;
    }
    if (!isBlackMember) {
      if (!toast.isActive("directerr")) {
        toast.info(
          <div
            onClick={() =>
              history.push({
                state: { showBlkMdl: true },
                pathname: "/settings"
              })
            }
          >
            {t("common:directerr")}
          </div>,
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: "directerr"
          }
        );
      }
      return;
    }
    setState({ ...state, msgModalVisible });
  };

  const setMessaged = profileID => {
    ErrorHandler.setBreadcrumb("Messaged:" + profileID);
    setMsgSent();
    setState({ ...state, msgModalVisible: false });
  };

  const { profilePic, id, users } = profile;

  let badge = "";
  if (users.every(user =>
    user.verifications.photoVer.active && user.verifications.stdVer.active
  )) {
    badge = "full-verified";
  } else if (users.every(user => user.verifications.stdVer.active)) {
    badge = "std-verified";
  } else if (users.every(user => user.verifications.photoVer.active)) {
    badge = "profile-verified";
  }

  return (
    <ErrorHandler.ErrorBoundary>
      <div className={isSelf || msgd ? "avatar-content no-btns" : "avatar-content"}>
        <div className={"avatar-card " + badge}>
          <ProfilePic profilePic={profilePic} handlePreview={handlePreview} />
          {!isSelf ? (
            <ProfileActions
              likeProfile={toggleLiked}
              showMsgModal={() => setMsgModalVisible(true)}
              liked={state.liked}
              msgd={msgd}
              t={t}
            />
          ) : (
              <div className="functions">
                <div className="btn share" onClick={showShareModal}>
                  {t("common:shareme")}
                </div>
              </div>
            )}
        </div>
      </div>
      {profile && state.msgModalVisible && (
        <DirectMsgModal
          profile={profile}
          close={() => setMsgModalVisible(false)}
          ErrorHandler={ErrorHandler}
          setMsgd={() => setMessaged(id)}
          ReactGA={ReactGA}
        />
      )}
      {state.maxLikeDlgVisible && (
        <DailyLimitModal
          close={setMaxLikeDlgVisible}
          t={t}
          history={history}
        />
      )}
      <Prompt
        message={(location, actionType) => {
          if (actionType === "POP") {
            history.goForward();
            setMsgModalVisible(false);
            return false;
          } else {
            return true;
          }
        }}
        when={state.msgModalVisible}
      />
    </ErrorHandler.ErrorBoundary>
  );
}

export default ProfileCard;
