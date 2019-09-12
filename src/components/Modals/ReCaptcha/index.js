import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import axios from "axios";

function onChange(value) {
  axios
    .post(process.env.REACT_APP_HTTPS_URL + "/allowIp", { capToken: value })
    .then(go());
}
//TODO:Remove test belwoe befoe done
const go = () => {
  if (window.location.pathname === "/captcha") {
    window.location.replace("/");
  } else {
    window.location.reload();
  }
};
const ReCaptcha = ({ t, tReady }) => {
  if (!tReady) {
    return (
      <Modal>
        <Spinner />
      </Modal>
    );
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
          sitekey={process.env.REACT_APP_GOOGLE_CLIENT_KEY}
          onChange={value => onChange(value)}
        />

        <button onClick={value => onChange("SSS")}>FIX</button>
        <br />
      </div>
    </Modal>
  );
};

export default withTranslation("modals")(ReCaptcha);
