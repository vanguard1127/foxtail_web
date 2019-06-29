import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const PrivacyText = lazy(() => import("./" + lang + "/PrivacyText"));
const Privacy = () => (
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
);

export default Privacy;
