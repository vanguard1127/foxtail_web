import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";

const lang = getLang();
const PrivacyText = lazy(() => import("./" + lang + "/PrivacyText"));

const Privacy = () => (
  <div>
    <div>
      <Link to="/">
        <span className="back-to-home" />
      </Link>
      <h1
        style={{
          justifyContent: "center",
          display: "flex",
          flex: 1
        }}
      >
        Privacy Policy
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
          <PrivacyText />
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

export default Privacy;
