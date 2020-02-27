import React, { useEffect, useState } from "react";
import Modal from "../../common/Modal";
var timer;
const Welcome = ({ close, t, ErrorBoundary, tReady }) => {
  const [timeLeft, setTimeLeft] = useState(59);
  const [mtimeLeft, setMTimeLeft] = useState(5);

  useEffect(() => {
    if (mtimeLeft === 0 && timeLeft === 0) {
      clearTimeout(timer);
      return;
    }
    timer = setTimeout(() => {
      if (timeLeft === 0) {
        setTimeLeft(59);
        setMTimeLeft(mtimeLeft - 1);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
  });

  const body = t("welcomemsg");
  const header = <div>{t("welcome")}</div>;
  const formattedNumber = ("0" + timeLeft).slice(-2);

  return (
    <Modal header={header} close={close}>
      <ErrorBoundary>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            textAlign: "center"
          }}
        >
          {body}
          <br />
          <div className="icon-box">
            <div className="stopwatch" />
          </div>
          <p>
            <b style={{ color: "#f50043" }}> {t("getthis")}</b>
            <br />
            {t("newbonus") + " "}{" "}
            <b> {mtimeLeft + ":" + formattedNumber + " " + t("minutes")}</b>
          </p>
        </div>
      </ErrorBoundary>
    </Modal>
  );
};

export default Welcome;
