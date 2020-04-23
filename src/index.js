import React from "react";
import ReactGA from "react-ga";
import { render } from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import DayJsUtils from "@date-io/dayjs";

// apollo
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { cache, link } from "./utils/links";

// material
import { materialTheme } from "./utils/materialTheme";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";

import App from "./App";

// external bad imports todo later
import("./assets/css/main.css");
import("./assets/favicon.ico" /* webpackPreload: true */);
import("react-image-lightbox/style.css" /* webpackPreload: true */);
import("owl.carousel/dist/assets/owl.carousel.css" /* webpackPreload: true */);
import(
  "owl.carousel/dist/assets/owl.theme.default.css" /* webpackPreload: true */
);
import("rc-slider/assets/index.css" /* webpackPreload: true */);

ReactGA.initialize("UA-106316956-1");
ReactGA.pageview(window.location.pathname + window.location.search);

const client = new ApolloClient({
  link,
  cache,
  assumeImmutableResults: true,
  connectToDevTools: process.env.NODE_ENV !== "production"
});

render(
  <ApolloProvider client={client}>
    <MuiPickersUtilsProvider utils={DayJsUtils}>
      <ThemeProvider theme={materialTheme}>
        <App />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

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
