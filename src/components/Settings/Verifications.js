import React, { Component } from "react";

class Verifications extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    const { openPhotoVerPopup, t, ErrorBoundary } = this.props;
    return (
      <ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("Verifications")} <i>- ({t("vertitle")})</i>
              </span>
            </div>
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Verifications;
