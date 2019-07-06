import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import axios from "axios";
function onChange(value) {
  console.log("VALUE", value);
  axios.post(
    process.env.NODE_ENV === "production"
      ? "https://foxtailapp.com/allowIp"
      : "http://localhost:3000/allowIp"
  );
}

const ReCaptcha = ({ t }) => {
  return (
    <Modal
      header={"Are you Human?"}
      description={t(
        "common:We've detected some bot-like behavior from your session. Please complete this captcha so we know you're human. Sorry for the inconvienence."
      )}
    >
      <div>
        <span onClick={() => onChange("value")}>DDFFDF</span>
        {/* <ReCAPTCHA
          sitekey={process.env.REACT_APP_GOOGLE_CLIENT_KEY}
          onChange={value => onChange(value)}
        /> */}
      </div>
    </Modal>
  );
};

export default withTranslation("modals")(ReCaptcha);
