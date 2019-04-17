import React, { Component } from "react";
import UpdateSubBtn from "./UpdateSubBtn";
import CancelSubBtn from "./CancelSubBtn";
class ManageBlackSub extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    console.log("MBS");
    const { refetchUser, ErrorHandler, t, currentuser, dayjs } = this.props;
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
                {dayjs(currentuser.blackMember.renewalDate)
                  .locale(localStorage.getItem("i18nextLng"))
                  .format("MMMM DD YYYY")}
              </div>
            )}
            {!currentuser.ccLast4 && (
              <div className="col-md-12">
                {t("common:blkend")}:{" "}
                {dayjs(currentuser.blackMember.renewalDate)
                  .locale(localStorage.getItem("i18nextLng"))
                  .format("MMMM DD YYYY")}
              </div>
            )}
            <div className="col-md-6">
              <div className="verification-box">
                <UpdateSubBtn
                  refetchUser={refetchUser}
                  t={t}
                  ErrorHandler={ErrorHandler}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="verification-box">
                <CancelSubBtn
                  refetchUser={refetchUser}
                  t={t}
                  ErrorHandler={ErrorHandler}
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
