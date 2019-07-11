import React from "react";
import ReactGA from "react-ga";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import i18n from "./i18n";
import * as Sentry from "@sentry/browser";
import { env } from "./docs/consts";
import Landing from "./components/Landing";
import About from "./components/Information/About";
import FAQ from "./components/Information/FAQ";
import Privacy from "./components/Information/Privacy";
import AntiSpam from "./components/Information/AntiSpam";
import ToS from "./components/Information/ToS";
import LawEnforce from "./components/Information/LawEnforce";
import Navbar from "./components/Navbar/";
import * as ErrorHandler from "./components/common/ErrorHandler";
import withAuth from "./components/HOCs/withAuth";
import Footer from "./components/Footer/";
import ReCaptcha from "./components/Modals/ReCaptcha";
import tokenHandler from "./utils/tokenHandler";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import ProfileSearch from "./components/SearchProfiles/";
import Settings from "./components/Settings/";
import EventPage from "./components/Event";
import ProfilePage from "./components/Profile/";
import InboxPage from "./components/Inbox/";
import SearchEvents from "./components/SearchEvents";

//TODO: REMOVE THIS IF
if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DNS
  });
}

ReactGA.initialize("UA-106316956-1");
ReactGA.pageview(window.location.pathname + window.location.search);

//let { httpurl, HTTPSurl, wsurl } = env.production;
let { httpurl, HTTPSurl, wsurl } = env.local;

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    })
  }
});

const httpLink = new HttpLink({
  uri: httpurl
});

const AuthLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-refresh-token": localStorage.getItem("refreshToken")
    }
  }));
  return forward(operation);
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const {
      response: { headers }
    } = operation.getContext();
    if (headers) {
      const token = headers.get("authorization");
      const refreshToken = headers.get("x-refresh-token");
      const lang = headers.get("lang");

      if (lang) {
        localStorage.setItem("i18nextLng", lang);
      }

      if (token) {
        localStorage.setItem("token", token.replace("Bearer", "").trim());
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  });
});

const httpLinkWithMiddleware = afterwareLink.concat(AuthLink.concat(httpLink));
const splitlink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithMiddleware
);

const cache = new InMemoryCache({
  dataIdFromObject: o => {
    if (o._id) return { [o.__typename]: o._id };
    else return null;
  }
});

const stateLink = withClientState({
  cache
});

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, path }) => {
        if (~message.indexOf("Client")) {
          if (!toast.isActive(message)) {
            toast(i18n.t("common:" + message.replace("Client:", "").trim()), {
              position: toast.POSITION.TOP_CENTER,
              toastId: message
            });
          }
        } else if (~message.indexOf("authenticated")) {
          tokenHandler({ operation, forward, HTTPSurl, ErrorHandler });
        } else {
          //TODO: Uncomment
          //  if (process.env.NODE_ENV === "development") {
          console.error("ERROR::::", message);
          // }
          Sentry.withScope(scope => {
            scope.setLevel("error");
            scope.setTag("resolver", path);
            scope.setFingerprint([window.location.pathname]);
            Sentry.captureException(message);
          });
          if (!toast.isActive("err")) {
            toast.error(
              <span>
                Something went wrong:
                <br />
                <span
                  onClick={() => Sentry.showReportDialog()}
                  style={{ color: "light-blue", textDecoration: "underline" }}
                >
                  Report feedback
                </span>
              </span>,
              {
                position: toast.POSITION.TOP_CENTER,
                toastId: "err"
              }
            );
          }
        }
        return null;
      });
    }
    if (networkError) {
      if (networkError.statusCode === 429) {
        window.location.replace("/captcha");
      } else {
        if (!toast.isActive("networkError")) {
          toast.info(
            i18n.t(
              "common:We're having trouble connecting to you. Please check your connection and try again."
            ),
            {
              position: toast.POSITION.TOP_CENTER,
              toastId: "networkError"
            }
          );
        }
      }
    }
    return null;
  }
);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = errorLink.concat(
  ApolloLink.from([stateLink, AuthLink, splitlink])
);

const client = new ApolloClient({
  link,
  cache
});

const Root = () => (
  <Router>
    <Wrapper />
  </Router>
);

const Wrapper = withRouter(props => {
  let location = props.location;
  if (location.pathname) {
    if (location.pathname === "/") {
      return <Landing {...props} ReactGA={ReactGA} />;
    } else if (location.pathname === "/tos") {
      return <ToS />;
    } else if (location.pathname === "/about") {
      return <About />;
    } else if (location.pathname === "/faq") {
      return <FAQ />;
    } else if (location.pathname === "/privacy") {
      return <Privacy />;
    } else if (location.pathname === "/antispam") {
      return <AntiSpam />;
    } else if (location.pathname === "/lawenforcement") {
      return <LawEnforce />;
    } else if (location.pathname === "/captcha") {
      return <ReCaptcha />;
    }
    let showFooter =
      location.pathname && location.pathname.match(/^\/inbox/) === null;

    return <Body showFooter={showFooter} location={location} />;
  } else {
    return null;
  }
});

const Body = withAuth(session => session && session.currentuser)(
  ({ showFooter, session }) => (
    <div
      className="layout"
      style={{
        height: "auto",
        margin: "0",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }}
    >
      <header>
        <Navbar ErrorHandler={ErrorHandler} session={session} />
      </header>
      <main style={{ display: "flex", flex: "3", flexDirection: "column" }}>
        <Switch>
          <Route
            path="/members"
            render={() => (
              <ProfileSearch ErrorHandler={ErrorHandler} ReactGA={ReactGA} />
            )}
            exact
          />
          <Route
            path="/events"
            render={() => (
              <SearchEvents ErrorHandler={ErrorHandler} ReactGA={ReactGA} />
            )}
            exact
          />
          <Route
            path="/event/:id"
            render={() => (
              <EventPage ErrorHandler={ErrorHandler} ReactGA={ReactGA} />
            )}
          />
          <Route
            path="/member/:id"
            render={() => (
              <ProfilePage ErrorHandler={ErrorHandler} ReactGA={ReactGA} />
            )}
          />
          <Route
            path="/inbox/:chatID"
            component={InboxPage}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
          <Route
            path="/inbox"
            component={InboxPage}
            ErrorHandler={ErrorHandler}
            ReactGA={ReactGA}
          />
          <Route
            path="/settings"
            render={() => (
              <Settings ErrorHandler={ErrorHandler} ReactGA={ReactGA} />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </main>
      {showFooter && <Footer />}
      <ToastContainer position="top-center" />
      {/* {showCaptcha && <ReCaptcha />} */}
    </div>
  )
);
render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById("root")
);
