import React from "react";
import "react-credit-cards/es/styles-compiled.css";
import "./CreditCard.css";

const ShareForm = ({
  close,
  t,
  tReady,
  ErrorHandler,
  ccLast4,
  toggleSharePopup
}) => {
  return (
    <div className="popup">
      <a className="close" onClick={close} />

      <div className="head">
        <h1>{t("Upgrade to Black")}</h1>
        <h4>
          {t(
            "For a Limited Time - Share Foxtail and Get 1 week FREE Black Membership"
          )}
        </h4>
      </div>
      <section className="blk">
        <div className="container">
          <div className="col-md-12">
            <div className="icon">
              <i className="nico blackmember" />
            </div>
          </div>
        </div>
      </section>
      <div className="cont">
        {t("inviteeveryone")}
        <br /> <br />
        {t("friendsfree")}
        <br /> <br />
        {t("refferalalready")}
        <br /> <br />
        {t("findcode")}:
        <br />
        <div>
          <li>{t("clickany")}</li>
          <li>{t("whennewmember")}</li>
          <li>{t("pleasenoteactive")}</li>
        </div>
      </div>
      <div className="form-container">
        <form className="form">
          <div className="form-content">
            <div className="submit form-control">
              <button
                className="color"
                onClick={e => {
                  e.preventDefault();
                  toggleSharePopup(false);
                }}
              >
                {t("common:Share")}
              </button>
              <button className="border" onClick={close}>
                {t("common:Cancel")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ShareForm;
