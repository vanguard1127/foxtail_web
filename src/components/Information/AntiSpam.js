import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const AntiSpamText = lazy(() => import("./" + lang + "/AntiSpamText"));
const AntiSpam = ({ history }) => (
  <div>
    <div>
      <span className="back-to-home" onClick={() => history.push("/")} />
      <h1
        style={{
          justifyContent: "center",
          display: "flex",
          flex: 1
        }}
      >
        ANTI-SPAM
      </h1>
    </div>{" "}
    <div
      style={{
        display: "flex",
        flex: 20
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1
        }}
      />{" "}
      <div
        style={{
          display: "flex",
          flex: 10,
          marginTop: "20px"
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "74vh",
                display: "flex",
                alignItems: "center",
                height: "100vh"
              }}
            >
              <Spinner message={"..."} size="large" />
            </div>
          }
        >
          <AntiSpamText />
        </Suspense>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1
        }}
      />
    </div>
  </div>
);

export default AntiSpam;
