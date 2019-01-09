import React from "react";

const Verifications = () => {
  return (
    <div className="content mtop">
      <div className="row">
        <div className="col-md-12">
          <span className="heading">
            Verifications <i>- (Verified members get more responses)</i>
          </span>
        </div>
        <div className="col-md-6">
          <div className="verification-box">
            <span className="head">Photo Verification</span>
            <span className="title">
              It is a long established fact that a reader will be…
            </span>
            <a
              href="#"
              className="clickverify-btn photo"
              onClick={() =>
                this.setState({ photoSubmitType: "verify" }, () =>
                  this.togglePhotoVerPopup()
                )
              }
            >
              Click Verification
            </a>
          </div>
        </div>
        <div className="col-md-6">
          <div className="verification-box">
            <span className="head">STD Verification</span>
            <span className="title">
              It is a long established fact that a reader will be…
            </span>
            <a
              href="#"
              className="clickverify-btn"
              onClick={() =>
                this.setState({ photoSubmitType: "std" }, () =>
                  this.togglePhotoVerPopup()
                )
              }
            >
              Click Verification
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verifications;
