import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const LawEnforceText = lazy(() => import("./" + lang + "/LawEnforceText"));
const LawEnforce = () => (
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
    <LawEnforceText />
  </Suspense>
);

export default LawEnforce;
