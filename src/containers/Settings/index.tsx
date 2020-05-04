import React, { useState } from "react";
import { RouteChildrenProps } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { WithTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
import { useQuery } from "react-apollo";
import { toast } from "react-toastify";

import { ISession } from "types/user";
import { GET_SETTINGS } from "queries";
import Spinner from "components/common/Spinner";
import "assets/css/breadcrumb.css";

import SettingsPage from "./SettingsPage";
import { IResponseData } from "./types/settings"
import "./settings.css";
import Header from "./Header";

interface ISettingsProps extends WithTranslation, RouteChildrenProps {
  session: ISession,
  refetch: any,
  ErrorHandler: any,
  ReactGA: any,
  dayjs: any,
  lang: string
}

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

  const [isCouple, setisCouple] = useState<boolean>(location && location.state && location.state.couple ? location.state.couple : false);
  const [isInitial, setisInitial] = useState<boolean>(location && location.state && location.state.initial ? location.state.initial : false);
  const [showBlkModal, setshowBlkModal] = useState<boolean>(location && location.state && location.state.showBlkMdl ? location.state.showBlkMdl : false);
  const [showCplModal, setshowCplModal] = useState<boolean>(location && location.state && location.state.showCplMdl ? location.state.showCplMdl : false);

  const { data, loading, error } = useQuery<IResponseData>(GET_SETTINGS, {
    variables: {
      isMobile: sessionStorage.getItem("isMobile"),
      maxW: window.outerWidth,
      maxH: window.outerHeight
    },
    fetchPolicy: "cache-and-network",
    returnPartialData: true
  });

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
          <Header username={session.currentuser.username} lastActive={settings.lastActive} lang={lang} dayjs={dayjs} t={t} />
        </div>
      </section>
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
    </>
  );



}

export default withRouter(withTranslation("settings")(Settings));
