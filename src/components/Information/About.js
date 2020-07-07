import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import getLang from "../../utils/getLang";
const lang = getLang();
const AboutText = lazy(() => import("./" + lang + "/AboutText"));
const About = () => (
  <div>
    <Link to="/">
      <span className="back-to-home" />
    </Link>
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
          flex: 10
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
          <AboutText />
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

export default About;
