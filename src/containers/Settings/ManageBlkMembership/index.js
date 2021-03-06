import React from "react";
import CancelSubBtn from "./CancelSubBtn";
const ManageBlackSub = ({
  refetchUser,
  ErrorHandler,
  t,
  currentuser,
  dayjs,
  notifyClient,
  initializeModal,
  lang,
  ccLast4,
  toggleCCModal,
  ReactGA
}) => {
  return (
    <ErrorHandler.ErrorBoundary>
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">{t("ManageBlackSub")}</span>
          </div>
          {ccLast4 && (
            <div className="col-md-12">
              {t("common:creditend")} {ccLast4} {t("common:renewdate")}:{" "}
              {currentuser.blackMember.renewalDate !== null
                ? dayjs(currentuser.blackMember.renewalDate)
                    .locale(lang)
                    .format("MMMM DD YYYY")
                : " Lifetime :)"}
            </div>
          )}
          {!ccLast4 && (
            <div className="col-md-12">
              {t("common:blkend")}:{" "}
              {currentuser.blackMember.renewalDate !== null
                ? dayjs(currentuser.blackMember.renewalDate)
                    .locale(lang)
                    .format("MMMM DD YYYY")
                : " Lifetime :)"}
            </div>
          )}
          <div className="col-md-6">
            <div className="verification-box">
              <span className="clickverify-btn photo" onClick={toggleCCModal}>
                {ccLast4 ? t("cardchange") : t("addchange")}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <CancelSubBtn
                refetchUser={refetchUser}
                t={t}
                ErrorHandler={ErrorHandler}
                notifyClient={notifyClient}
                initializeModal={initializeModal}
                ReactGA={ReactGA}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default ManageBlackSub;
