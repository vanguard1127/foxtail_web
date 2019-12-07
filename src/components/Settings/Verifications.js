import React, { Component } from "react";

class Verifications extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  render() {
    const { openPhotoVerPopup, t, ErrorBoundary, verifications } = this.props;
    return (
      <ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("Verifications")} <i>- ({t("vertitle")})</i>{" "}
              </span>
            </div>
            <div className="col-md-6">
              {!verifications.includes("photo") ? (
                <div className="verification-box">
                  <span className="head">{t("photoverification")}</span>
                  <span className="title">{t("photovermsg") + "..."}</span>
                  <span
                    className="clickverify-btn photo"
                    onClick={() => openPhotoVerPopup("verify")}
                  >
                    {t("sendver")}
                  </span>
                </div>
              ) : (
                <div className="verification-box">
                  <span className="head" style={{ textAlign: "center" }}>
                    {t("photocomp")}
                  </span>
                </div>
              )}
            </div>
            <div className="col-md-6">
              {!verifications.includes("std") ? (
                <div className="verification-box">
                  <span className="head">{t("stdverification")}</span>
                  <span className="title">{t("stdmsg") + "..."}</span>
                  <span
                    className="clickverify-btn"
                    onClick={() => openPhotoVerPopup("std")}
                  >
                    {t("sendver")}
                  </span>
                </div>
              ) : (
                <div className="verification-box">
                  <span className="head" style={{ textAlign: "center" }}>
                    {t("stdcomp")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Verifications;
