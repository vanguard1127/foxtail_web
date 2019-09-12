import React, { lazy, Suspense } from "react";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const FAQText = lazy(() => import("./" + lang + "/FAQText"));
const FAQ = ({ history }) => (
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
    <span className="back-to-home" onClick={() => history.push("/")} />
    <FAQText />
  </Suspense>
);

export default FAQ;
