import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as Sentry from "@sentry/browser";

// firebase todo handler bad import
import * as firebase from "firebase/app";
import "firebase/auth";

import { preventContextMenu } from "./utils/image";
import detectMob from "./utils/detectMobile";

import MainRoutes from "./components/Layout/Wrapper";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSEGE_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS,
  ignoreErrors: ["Client:", "authenticated"]
});

// todo remove props get it right there !
const App = ({ lang }) => {
  useEffect(() => {
    window.onresize = function() {
      document.body.height = window.innerHeight;
    };
    document.addEventListener("contextmenu", preventContextMenu);
    window.scrollTo(0, 1);
    sessionStorage.setItem("isMobile", detectMob());
  }, []);

  return (
    <React.Fragment>
      <Router>
        <MainRoutes lang={lang} />
      </Router>
      <ToastContainer position="top-center" hideProgressBar={true} />
    </React.Fragment>
  );
};

export default App;
