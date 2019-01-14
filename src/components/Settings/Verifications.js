import React from "react";

const Verifications = ({ openPhotoVerPopup, t }) => {
  return (
    <div className="content mtop">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">
            {t("Verifications")}{" "}
            <i>- ({t("Verified members get more responses")})</i>
          </span>
        </div>
        <div className="col-md-6">
          <div className="verification-box">
            <span className="head">{t("Photo Verification")}</span>
            <span className="title">
              {t("Show members you are who you say you are…")}
            </span>
            <span
              className="clickverify-btn photo"
              onClick={() => openPhotoVerPopup("verify")}
            >
              {t("Send Verification")}
            </span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="verification-box">
            <span className="head">{t("STD Verification")}</span>
            <span className="title">
              {t("Show members you care about your health and theirs…")}
            </span>
            <span
              className="clickverify-btn"
              onClick={() => openPhotoVerPopup("std")}
            >
              {t("Send Verification")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verifications;
