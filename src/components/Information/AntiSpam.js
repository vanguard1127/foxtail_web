import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const AntiSpamText = lazy(() => import("./" + lang + "/AntiSpamText"));
const AntiSpam = () => (
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
);

export default AntiSpam;
