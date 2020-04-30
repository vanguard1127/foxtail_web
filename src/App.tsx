import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as Sentry from "@sentry/browser";

import firebase from "firebase/app";
import "firebase/auth";

// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import getLang from "./utils/getLang";
import 'dayjs/locale/en';
import 'dayjs/locale/de';
const lang = getLang();
dayjs.locale(lang)
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

import { preventContextMenu } from "./utils/image";
import detectMob from "./utils/detectMobile";

import AppRoutes from "./routes/AppRoutes";

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

const App: React.FC = () => {
  useEffect(() => {
    document.addEventListener("contextmenu", preventContextMenu);
    window.scrollTo(0, 1);
    sessionStorage.setItem("isMobile", detectMob().toString());
  }, []);

  return (
    <div>
      <Router>
        <AppRoutes lang={lang} />
      </Router>
      <ToastContainer position="top-center" hideProgressBar={true} />
    </div>
  );
};

export default App;
