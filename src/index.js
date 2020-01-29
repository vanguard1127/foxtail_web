import React from "react";
import ReactGA from "react-ga";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import * as Sentry from "@sentry/browser";
import DayJsUtils from "@date-io/dayjs";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import { preventContextMenu } from "./utils/image";
import * as firebase from "firebase/app";
import "firebase/auth";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import { cache, link } from "./utils/links";
import { materialTheme } from "./utils/materialTheme";
import { Wrapper } from "./components/Layout/Wrapper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import getLang from "./utils/getLang";
import("core-js/stable" /* webpackPreload: true */);
import("regenerator-runtime/runtime" /* webpackPreload: true */);
import("./assets/css/main.css" /* webpackPreload: true */);
import("./assets/favicon.ico" /* webpackPreload: true */);
import("react-image-lightbox/style.css" /* webpackPreload: true */);
import("owl.carousel/dist/assets/owl.carousel.css" /* webpackPreload: true */);
import(
  "owl.carousel/dist/assets/owl.theme.default.css" /* webpackPreload: true */
);
import("rc-slider/assets/index.css" /* webpackPreload: true */);
const lang = getLang();
import("dayjs/locale/" + lang);

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS,
  ignoreErrors: ["Client:", "authenticated"]
});

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

ReactGA.initialize("UA-106316956-1");
ReactGA.pageview(window.location.pathname + window.location.search);

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const client = new ApolloClient({
  link,
  cache,
  assumeImmutableResults: true,
  connectToDevTools: process.env.NODE_ENV !== "production"
});

const Root = () => (
  <Router>
    <Wrapper lang={lang} dayjs={dayjs} />
  </Router>
);

window.onresize = function() {
  document.body.height = window.innerHeight;
};
window.onresize(); // called to initially set the height.
window.scrollTo(0, 1);
//prevent context menu
document.addEventListener("contextmenu", preventContextMenu);

render(
  <ApolloProvider client={client}>
    <MuiPickersUtilsProvider utils={DayJsUtils}>
      <ThemeProvider theme={materialTheme}>
        <Root />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

if (process.env.NODE_ENV !== "production") {
  OfflinePluginRuntime.install({
    onUpdateReady: () => {
      // Tells to new SW to take control immediately
      OfflinePluginRuntime.applyUpdate();
    },
    onUpdated: () => {
      // Reload the webpage to load into the new version
      window.location.reload();
    }
  });
}
