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
      <a className="close" onClick={() => close()} />

      <div className="head">
        <h1>Upgrade to Black</h1>
        <h4>
          For a Limited Time: Share Foxtail and Get 1 week FREE Black Membership
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
      <p>
        Everyone with a Foxtail account has a personal invite code that you can
        share with friends interested in joining our sex-positive community.
        <br /> <br />
        You and your friend will receive 1 free week Black membership when they
        signup. You are only eligible for 1 week per individual, and there is no
        limit to how many you can earn (e.g. 52 friends = 1 year).
        <br /> <br />
        If your referral has already signed up for Foxtail before, you may not
        be eligible for this reward. <br /> <br />
        Ways to find and share your invite code:
        <br />
        <ul>
          <li>
            Click any share button, including social buttons, from within
            Foxtail. Share on any sites like Fet, Reddit, Facebook, etc…
          </li>
          <li>
            When a new member joins from one of your share links you will be
            notified.
          </li>
          <li>
            Please note: Black membership is activated once the member joins and
            cancels 1 week later unless you get more referrals.
          </li>
        </ul>
      </p>
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
                Share
              </button>

              <button className="border" onClick={() => close()}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ShareForm;
