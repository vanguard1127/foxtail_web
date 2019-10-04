import React, { Component } from "react";
import UpdateSubBtn from "./UpdateSubBtn";
import CancelSubBtn from "./CancelSubBtn";
class ManageBlackSub extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const {
      refetchUser,
      ErrorHandler,
      t,
      currentuser,
      dayjs,
      notifyClient,
      setDialogContent,
      lang,
      ReactGA
    } = this.props;
    return (
      <ErrorHandler.ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("ManageBlackSub")} <i>- ({t("vertitle")})</i>
              </span>
            </div>
            {currentuser.ccLast4 && (
              <div className="col-md-12">
                {t("common:creditend")} {currentuser.ccLast4}{" "}
                {t("common:renewdate")}:{" "}
                {currentuser.blackMember.renewalDate
                  ? dayjs(currentuser.blackMember.renewalDate)
                      .locale(lang)
                      .format("MMMM DD YYYY")
                  : "Lifetime :)"}
              </div>
            )}
            {!currentuser.ccLast4 && (
              <div className="col-md-12">
                {t("common:blkend")}:{" "}
                {dayjs(currentuser.blackMember.renewalDate)
                  .locale(lang)
                  .format("MMMM DD YYYY")}
              </div>
            )}
            <div className="col-md-6">
              <div className="verification-box">
                <UpdateSubBtn
                  refetchUser={refetchUser}
                  t={t}
                  ErrorHandler={ErrorHandler}
                  notifyClient={notifyClient}
                  lang={lang}
                  currCCLast4={currentuser.ccLast4}
                  ReactGA={ReactGA}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="verification-box">
                <CancelSubBtn
                  refetchUser={refetchUser}
                  t={t}
                  ErrorHandler={ErrorHandler}
                  notifyClient={notifyClient}
                  setDialogContent={setDialogContent}
                  ReactGA={ReactGA}
                />
              </div>
            </div>
          </div>
        </div>
      </ErrorHandler.ErrorBoundary>
    );
  }
}

export default ManageBlackSub;
