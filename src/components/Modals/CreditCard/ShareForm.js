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
          {t("For a Limited Time - Share Foxtail")}
          <br /> {t("Get 1 week FREE Black Membership")}
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
        {t("modals:inviteeveryone")}
        <br /> <br />
        {t("modals:friendsfree")}
        <br /> <br />
        {t("modals:refferalalready")}
        <br /> <br />
        <strong style={{ fontSize: "larger" }}>
          <i>{t("modals:findcode")}</i>
        </strong>
        <br />
        <div style={{ marginTop: "15px" }}>
          {t("modals:clickany")}
          <hr />
          {t("modals:whennewmember")}
          <hr />
          {t("modals:pleasenoteactive")}
          <hr />
        </div>
      </div>
      <div className="form-container">
        <form>
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
