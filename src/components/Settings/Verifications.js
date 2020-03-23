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
    let photoBtn, stdBtn;
    switch (verifications.photo) {
      case "active":
        photoBtn = (
          <div className="verification-box">
            <span className="head" style={{ textAlign: "center" }}>
              {t("photocomp")}
            </span>
          </div>
        );
        break;
      case "pending":
        photoBtn = (
          <div className="verification-box">
            <span className="head" style={{ textAlign: "center" }}>
              Photo Verification Pending
            </span>
          </div>
        );
        break;
      default:
        photoBtn = (
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
        );
        break;
    }

    switch (verifications.std) {
      case "active":
        stdBtn = (
          <div className="verification-box">
            <span className="head" style={{ textAlign: "center" }}>
              {t("stdcomp")}
            </span>
          </div>
        );
        break;
      case "pending":
        stdBtn = (
          <div className="verification-box">
            <span className="head" style={{ textAlign: "center" }}>
              STD Verification Pending
            </span>
          </div>
        );
        break;
      default:
        stdBtn = (
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
        );
        break;
    }
    return (
      <ErrorBoundary>
        <div className="content mtop">
          <div className="row">
            <div className="col-md-12">
              <span className="heading">
                {t("Verifications")} <i>- ({t("vertitle")})</i>{" "}
              </span>
            </div>
            <div className="col-md-6">{photoBtn}</div>
            <div className="col-md-6">{stdBtn}</div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default Verifications;
