import React, { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { withTranslation } from "react-i18next";

const Welcome = ({ close, t, ErrorBoundary, tReady }) => {
  const [timeLeft, setTimeLeft] = useState(59);
  const [mtimeLeft, setMTimeLeft] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      if (mtimeLeft === 0) {
        clearTimeout();
      }
      if (timeLeft === 0) {
        setTimeLeft(59);
        setMTimeLeft(mtimeLeft - 1);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
  });

  if (!tReady) {
    return null;
  }
  const body = t("welcomemsg");
  const header = <div>{t("welcome")}</div>;
  const formattedNumber = ("0" + timeLeft).slice(-2);
  // let refUrl = `${process.env.REACT_APP_CLIENT_URL}/${data.setFullLink}`;
  return (
    <Modal header={header} close={close}>
      <ErrorBoundary>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {body}
          <br />
          <div className="icon-box">
            <div className="stopwatch" />
          </div>
          <p
            style={{
              textAlign: "center"
            }}
          >
            {t("newbonus") + " "}
            <b> {mtimeLeft + ":" + formattedNumber + " " + t("minutes")}</b>
            <br />
            <b style={{ color: "#f50043" }}> {t("getthis")}</b>
          </p>
        </div>
      </ErrorBoundary>
    </Modal>
  );
};

export default withTranslation("modals")(Welcome);
