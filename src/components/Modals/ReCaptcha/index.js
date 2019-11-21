import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import axios from "axios";

function onChange(value) {
  axios
    .post(process.env.REACT_APP_HTTPS_URL + "/allowIp", { capToken: value })
    .then(go());
}

const go = () => {
  if (window.location.pathname === "/captcha") {
    window.location.replace("/");
  } else {
    window.location.reload(false);
  }
};
const ReCaptcha = ({ t, tReady }) => {
  if (!tReady) {
    return null;
  }

  return (
    <Modal
      header={"Are you Human?"}
      description={t(
        "common:We've detected some bot-like behavior from your session. Please complete this captcha so we know you're human. Sorry for the inconvienence."
      )}
    >
      <div>
        <ReCAPTCHA
          sitekey={"6LdvxqYUAAAAAEnP6CGkMWBUiznH8Ulm6K1Mm4A9"}
          onChange={value => onChange(value)}
        />
        <br />
      </div>
    </Modal>
  );
};

export default withTranslation("modals")(ReCaptcha);
