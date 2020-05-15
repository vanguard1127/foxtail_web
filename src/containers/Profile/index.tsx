import React, { memo, useState, useEffect } from "react";
import { Prompt, RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";

import { GET_PROFILE, LIKE_PROFILE } from "queries";
import BlockModal from "components/Modals/Block";
import ShareModal from "components/Modals/Share";
import Spinner from "components/common/Spinner";

import KinksSection from "./components/KinksSection";
import ProfileCard from "./components/ProfileCard";
import ProfileInfo from "./components/ProfileInfo";
import ProfileBio from "./components/ProfileBio";
import KinksMobile from "./components/KinksMobile";
import ProfileDetails from "./components/ProfileDetails";
import PhotoSlider from "./components/PhotoSlider";

import { flagOptions } from "../../docs/options";

import "./profile.css";
import MatchDlgModal from "./components/MatchDlgModal";

interface MatchProps {
  id: string;
}

interface IProfilePageProps extends RouteComponentProps<MatchProps>, WithTranslation {
  ErrorHandler: any;
  ReactGA: any;
  session: any;
  dayjs: any;
}

const ProfilePage: React.FC<IProfilePageProps> = memo(({
  ErrorHandler,
  ReactGA,
  session,
  dayjs,
  history,
  match,
  tReady,
  t,
}) => {
  const [state, setState] = useState({
    shareModalVisible: false,
    blockModalVisible: false,
    profile: null,
    matched: false,
    matchDlgVisible: false,
    chatID: null,
    isRemove: false,
    previewVisible: false,
    selectedImg: null
  });

  const [likeProfile] = useMutation(LIKE_PROFILE, {
    variables: { toProfileID: match.params.id }
  });

  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: {
      id: match.params.id,
      isMobile: sessionStorage.getItem("isMobile"),
      maxW: window.outerWidth,
      maxH: window.outerHeight
    },
    returnPartialData: true,
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    window.scrollTo(0, 1);
  }, [])

  const setMatchDlgVisible = (matchDlgVisible: boolean, profile?: any, chatID?: any) => {
    ErrorHandler.setBreadcrumb("Match Dialog Toggled:");
    if (profile) {
      setState({ ...state, profile, matchDlgVisible, chatID, matched: true });
    } else {
      setState({ ...state, matchDlgVisible });
    }
  };

  const setShareModalVisible = (shareModalVisible: boolean, profile?: any) => {
    ErrorHandler.setBreadcrumb("Share Modal Opened:" + shareModalVisible);
    if (shareModalVisible) {
      ReactGA.event({
        category: "Profile",
        action: "Share Modal"
      });
    }
    if (profile) {
      setState({ ...state, profile, shareModalVisible });
    } else {
      setState({ ...state, shareModalVisible });
    }
  };

  const setBlockModalVisible = (blockModalVisible: boolean, profile?: any, isRemove: boolean = false) => {
    ErrorHandler.setBreadcrumb("Block Modal Opened:" + blockModalVisible);
    if (profile) {
      setState({ ...state, isRemove, profile, blockModalVisible });
    } else {
      setState({ ...state, blockModalVisible });
    }
  };

  const goBack = () => {
    history.goBack();
  };

  const handleLike = (profile, likeProfile) => {
    ErrorHandler.setBreadcrumb("Like Profile:" + likeProfile);
    likeProfile()
      .then(({ data }) => {
        switch (data.likeProfile) {
          case "like":
            toast.success(`${t("common:Liked")} ${profile.profileName}!`, {
              autoClose: 1500,
              hideProgressBar: true
            });
            ReactGA.event({
              category: "Profile",
              action: "Like"
            });
            break;
          case "unlike":
            toast.success(`${t("common:UnLiked")} ${profile.profileName}!`, {
              autoClose: 1500,
              hideProgressBar: true
            });
            ReactGA.event({
              category: "Profile",
              action: "UnLike"
            });
            break;
          default:
            setMatchDlgVisible(true, profile, data.likeProfile);
            ReactGA.event({
              category: "Profile",
              action: "Match"
            });
            break;
        }
      })
      .catch(res => { ErrorHandler.catchErrors(res); });
  };

  const setMsgSent = () => {
    setState({ ...state, matched: true });
  };

  const handlePreview = e => {
    setState({
      ...state,
      selectedImg: e.target.getAttribute("src"),
      previewVisible: true
    });
  };

  const closePreview = () => {
    setState({ ...state, previewVisible: false });
  };

  if (!tReady) {
    return <Spinner />;
  }
  ErrorHandler.setBreadcrumb("Open Profile:" + match.params.id);

  if (error) {
    document.title = t("common:error");
    return (
      <ErrorHandler.report
        error={error}
        calledName={"getProfile"}
        userID={session.currentuser.userID}
        targetID={match.params.id}
        type="profile"
      />
    );
  }
  if (loading) {
    document.title = t("common:Loading") + "...";
    return <Spinner message={t("common:Loading")} size="large" />;
  }
  else if (!data || !data.profile || data.profile.users.length === 0) {
    return (
      <section className="not-found">
        <div className="container">
          <div className="col-md-12">
            <div className="icon">
              <i className="nico x" />
            </div>
            <span className="head">{t("nopro")}</span>
            <span className="description">{t("notexist")}</span>
          </div>
        </div>
      </section>
    );
  }

  const profile = data.profile;
  document.title = profile.profileName;

  const {
    users,
    publicPhotos,
    privatePhotos,
    kinks,
    about
  } = profile;

  const {
    blockModalVisible,
    shareModalVisible,
    matchDlgVisible,
    chatID,
    matched,
    isRemove,
    previewVisible,
    selectedImg
  } = state;

  return (
    <section className="profile">
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <ProfileCard
                profile={profile}
                likeProfile={() => handleLike(profile, likeProfile)}
                t={t}
                liked={profile.likedByMe}
                msgd={profile.msgdByMe || matched}
                ErrorHandler={ErrorHandler}
                isSelf={session.currentuser.profileID === match.params.id}
                toast={toast}
                ReactGA={ReactGA}
                isBlackMember={session.currentuser.blackMember.active}
                history={history}
                likesSent={session.currentuser.likesSent}
                msgsSent={session.currentuser.msgsSent}
                showShareModal={() => setShareModalVisible(true, profile)}
                setMsgSent={setMsgSent}
                handlePreview={handlePreview}
              />
              <KinksSection
                kinks={kinks}
                t={t}
                ErrorBoundary={ErrorHandler.ErrorBoundary}
              />
            </div>
            <div className="col-md-9">
              <ProfileInfo
                profileName={profile.profileName}
                users={users}
                online={profile.online && profile.showOnline}
                dayjs={dayjs}
                ErrorBoundary={ErrorHandler.ErrorBoundary}
              />
              <ProfileDetails
                users={users}
                profile={profile}
                showBlockModal={() => setBlockModalVisible(true, profile)}
                showRemoveModal={() => setBlockModalVisible(true, profile, true)}
                showShareModal={() => setShareModalVisible(true, profile)}
                t={t}
                ErrorBoundary={ErrorHandler.ErrorBoundary}
                distanceMetric={session.currentuser.distanceMetric}
                showRemove={profile.id !== session.currentuser.profileID}
              />
              <ProfileBio
                about={about}
                t={t}
                ErrorBoundary={ErrorHandler.ErrorBoundary}
              />

              <KinksMobile
                kinks={kinks}
                t={t}
                ErrorBoundary={ErrorHandler.ErrorBoundary}
              />
              {publicPhotos.length > 0 && (
                <PhotoSlider
                  isPublic={true}
                  photos={publicPhotos}
                  t={t}
                  ErrorHandler={ErrorHandler}
                  handlePreview={handlePreview}
                />
              )}
              {privatePhotos.length > 0 && (
                <PhotoSlider
                  isPublic={false}
                  photos={privatePhotos}
                  t={t}
                  ErrorHandler={ErrorHandler}
                  handlePreview={handlePreview}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {previewVisible && (
        <Lightbox
          mainSrc={selectedImg}
          onCloseRequest={closePreview}
        />
      )}
      {profile && blockModalVisible && (
        <BlockModal
          id={profile.id}
          profile={profile}
          close={() => setBlockModalVisible(false)}
          goBack={goBack}
          type={flagOptions.Profile}
          ErrorHandler={ErrorHandler}
          ReactGA={ReactGA}
          isRemove={isRemove}
          isProfile={true}
        />
      )}
      {profile && shareModalVisible && (
        <ShareModal
          userID={session.currentuser.userID}
          profile={profile}
          close={() => setShareModalVisible(false)}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
          t={t}
        />
      )}

      {profile && chatID && matchDlgVisible && (
        <MatchDlgModal
          onConfirm={() => history.push({ pathname: "/inbox", state: { chatID } })}
          closeModal={() => setMatchDlgVisible(false)}
          profileName={profile.name}
          t={t}
        />
      )}
      <Prompt
        message={(location, actionType) => {
          if (actionType === "POP") {
            history.goForward();
            setState({ ...state, previewVisible: false });
            return false;
          } else {
            return true;
          }
        }}
        when={previewVisible}
      />
    </section>
  );
});

export default withTranslation("profile")(ProfilePage);
