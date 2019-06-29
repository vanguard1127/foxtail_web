import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const ToSText = lazy(() => import("./" + lang + "/ToSText"));
const ToS = () => (
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
    <ToSText />
  </Suspense>
);

export default ToS;
