import React from "react";
import RequestEmailVerBtn from "./RequestEmailVerBtn";
import ChangePhoneBtn from "./ChangePhoneBtn";
const AcctSettings = ({
  ErrorHandler,
  t,
  lang,
  isEmailOK,
  ReactGA,
  passEnabled,
  refetchUser,
  initializeModal,
  okAction,
  toggleClearPassDlg,
  toggleResetPassDlg
}) => {
  return (
    <ErrorHandler.ErrorBoundary>
      <div className="content mtop">
        <div className="row">
          <div className="col-md-12">
            <span className="heading">{t("acctsetting")}</span>
          </div>
          <div className="col-md-6">
            <div className="switch-con no-border">
              <div className="sw-head">{t("2faenable")}:</div>
              <div className="sw-btn">
                <div className="switch">
                  <input
                    type="checkbox"
                    id="passEnabled"
                    checked={passEnabled ? true : false}
                    onChange={() => {
                      if (!passEnabled) {
                        toggleResetPassDlg();
                      } else {
                        toggleClearPassDlg();
                      }
                      refetchUser();
                    }}
                  />
                  <label htmlFor="passEnabled" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <div className="verification-box">
              <span
                className="clickverify-btn"
                onClick={() => {
                  const modalTitle = t("updemail");
                  const modalDecription = t("updemaildes");
                  const modalBtnText = t("common:Update");
                  const modalPlaceholder = t("emailplaceholder");
                  initializeModal({
                    modalTitle,
                    modalDecription,
                    modalClassName: "acctsetting",
                    okAction,
                    modalBtnText,
                    modalPlaceholder,
                    modalInputType: "email",
                    schemaType: "email"
                  });
                }}
              >
                {t("updemail")}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <ChangePhoneBtn
              t={t}
              ErrorHandler={ErrorHandler}
              lang={lang}
              ReactGA={ReactGA}
            />
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <span
                className="clickverify-btn"
                onClick={() => {
                  const modalTitle = t("usrupd");
                  const modalDecription = t("usrupddes");
                  const modalBtnText = t("common:Update");
                  const modalPlaceholder = t("unplaceholder");
                  initializeModal({
                    modalTitle,
                    modalDecription,
                    modalClassName: "acctsetting",
                    okAction,
                    modalBtnText,
                    modalPlaceholder,
                    modalInputType: "text",
                    schemaType: "username"
                  });
                }}
              >
                {t("usrupd")}
              </span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="verification-box">
              <span
                className="clickverify-btn"
                onClick={() => {
                  const modalTitle = t("updgen");
                  const modalDecription = t("updgendes");
                  const modalBtnText = t("common:Update");
                  const modalPlaceholder = t("common:Sex") + ":";
                  initializeModal({
                    modalTitle,
                    modalDecription,
                    modalClassName: "acctsetting",
                    okAction,
                    modalBtnText,
                    modalInputType: "sex",
                    modalPlaceholder,
                    schemaType: "sex"
                  });
                }}
              >
                {t("chngsex")}
              </span>
            </div>
          </div>

          {!isEmailOK && (
            <div className="col-md-12">
              <div className="verification-box">
                <RequestEmailVerBtn
                  t={t}
                  ErrorHandler={ErrorHandler}
                  ReactGA={ReactGA}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorHandler.ErrorBoundary>
  );
};

export default AcctSettings;
