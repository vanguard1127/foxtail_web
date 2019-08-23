import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Spinner from "../../common/Spinner";
import axios from "axios";

function onChange(value) {
  axios.post("http://localhost:4444/allowIp", { capToken: value }).then(go());
  // axios
  //   .post(
  //     process.env.NODE_ENV === "production"
  //       ? process.env.REACT_APP_PROD_API_URL + "/allowIp"
  //       : "http://localhost:4444/allowIp",
  //     { capToken: value }
  //   )
  //   .then(go());
}

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
  //TODO: UNdo the chnges for therbuttin
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

        <button onClick={value => onChange(value)}>FIX</button>
        <br />
      </div>
    </Modal>
  );
};

export default withTranslation("modals")(ReCaptcha);
