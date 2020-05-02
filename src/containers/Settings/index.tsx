import React, { useEffect } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { WithTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
import { useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { ISession } from "../../types/user";
import { GET_SETTINGS } from "../../queries";
import Spinner from "../../components/common/Spinner";
import SettingsPage from "./SettingsPage";
import "./settings.css";
import "../../assets/css/breadcrumb.css";

interface ISettingsProps extends WithTranslation, RouteChildrenProps {
  session: ISession,
  refetch: any,
  ErrorHandler: any,
  ReactGA: any,
  dayjs: any,
  lang: string
}

interface IResponseData {
  getSettings: {
    distance: number
    distanceMetric: string
    ageRange: number[]
    lang: string
    interestedIn: string[]
    city: string
    visible: boolean
    newMsgNotify: boolean
    emailNotify: boolean
    showOnline: boolean
    likedOnly: boolean
    vibrateNotify: boolean
    profilePic: string
    profilePicUrl: string
    couplePartner: string
    includeMsgs: boolean
    lastActive: Date
    users: {
      username: string
      verifications: {
        photoVer: {
          active: boolean
        }
        stdVer: {
          active: boolean
        }
      }
    }
    publicPhotos: {
      smallUrl: string
      url: string
      key: string
      id: string
    }[]
    privatePhotos: {
      smallUrl: string
      url: string
      key: string
      id: string
    }[]
    about: string
    kinks: string[]
    sexuality: string
    password: string
    ccLast4: number
    verifications: {
      photo: string
      std: string
    }
    __typename: string;
  }
}
let mounted: boolean, isCouple: boolean = false, isInitial: boolean = false, showBlkModal: boolean = false, showCplModal: boolean = false;
const Settings: React.FC<ISettingsProps> = ({
  session,
  refetch,
  t,
  ErrorHandler,
  location,
  history,
  ReactGA,
  tReady,
  dayjs,
  lang
}) => {

  const { data, loading, error } = useQuery<IResponseData>(GET_SETTINGS, {
    variables: {
      isMobile: sessionStorage.getItem("isMobile"),
      maxW: window.outerWidth,
      maxH: window.outerHeight
    },
    fetchPolicy: "cache-and-network",
    returnPartialData: true
  });

  useEffect((): any => {
    mounted = true;
    document.title = t("common:myaccount");

    const { state }: any = location;
    //For page open responses
    if (state) {
      if (state.couple) isCouple = state.couple;
      if (state.initial) isInitial = state.initial;
      if (state.showBlkMdl) showBlkModal = state.showBlkMdl;
      if (state.showCplMdl) showCplModal = state.showCplMdl;
    }

    return () => mounted = false;
  }, [])

  if (!tReady) {
    return <Spinner />;
  }

  if (
    loading ||
    !data ||
    !data.getSettings ||
    !session ||
    !session.currentuser
  ) {
    document.title = t("common:Loading") + "...";
    return (
      <div
        style={{
          minHeight: "74vh",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Spinner message={t("common:Loading") + "..."} size="large" />
      </div>
    );
  }

  document.title = t("common:myaccount");

  if (error) {
    return (
      <ErrorHandler.report
        error={error}
        calledName="getSettings"
        userID={session.currentuser.userID}
      />
    );
  }

  const settings = data.getSettings;

  const { about, publicPhotos, profilePic, kinks } = settings;

  let aboutErr = null;
  if (about === "") {
    aboutErr = t("fillbio");
  } else if (about.length <= 20) {
    aboutErr = t("biolen");
  }

  let profilePicErr = null;
  if (publicPhotos.length === 0) {
    profilePicErr = t("onepho");
  } else if (profilePic === "") {
    profilePicErr = t("selpho");
  }

  let kinksErr = kinks.length === 0 ? t("onedes") : null;

  const errors = {
    profilePic: profilePicErr,
    about: aboutErr,
    kinks: kinksErr
  };

  return (
    <>
      <section className="breadcrumb settings">
        <div className="container">
          <div className="col-md-12">
            <span className="head">
              <span>
                {t("Hello")}, {session.currentuser.username} 👋
                      </span>
            </span>
            <span className="title">
              {t("loggedin")}:{" "}
              {dayjs(settings.lastActive)
                .locale(lang)
                .format("MMMM DD, YYYY @ HH:mm")}
            </span>
          </div>
        </div>
      </section>{" "}
      {mounted && (
        <SettingsPage
          t={t}
          settings={settings}
          refetchUser={refetch}
          isCouple={isCouple}
          isInitial={isInitial}
          showBlkModal={showBlkModal}
          showCplModal={showCplModal}
          ErrorHandler={ErrorHandler}
          history={history}
          currentuser={session.currentuser}
          dayjs={dayjs}
          lang={lang}
          ReactGA={ReactGA}
          errors={errors}
          toast={toast}
        />
      )}
    </>
  );



}

export default withRouter(withTranslation("settings")(Settings));
