import React from "react";
import { render } from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as Sentry from "@sentry/browser";
import { env } from "./docs/consts";
import Landing from "./components/Landing";
import About from "./components/Information/About";
import FAQ from "./components/Information/FAQ";
import Privacy from "./components/Information/Privacy";
import Support from "./components/Information/Support";
import ToS from "./components/Information/ToS";
import EmailConfirm from "./components/Landing/EmailConfirm";
import PhoneConfirm from "./components/Landing/PhoneConfirm";
import Navbar from "./components/Navbar/";
import ProfileSearch from "./components/SearchProfiles/";
import Settings from "./components/Settings/";
import EventPage from "./components/Event";
import ProfilePage from "./components/Profile/";
import InboxPage from "./components/Inbox/";
import SearchEvents from "./components/SearchEvents";
import * as ErrorHandler from "./components/common/ErrorHandler";
import withSession from "./components/HOCs/withSession";
import "./i18n";
import Footer from "./components/Footer/";
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

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS
});

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
            toast(message.replace("Client:", "").trim(), {
              position: toast.POSITION.TOP_CENTER,
              toastId: message
            });
          }
        } else if (~message.indexOf("authenticated")) {
          tokenHandler({ operation, forward, HTTPSurl, ErrorHandler });
        } else {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            console.error("ERROR::::", message);
          }
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
      if (!toast.isActive(networkError)) {
        toast.warn(
          "We're having trouble connecting to you. Please check your connection and try again.",
          {
            position: toast.POSITION.TOP_CENTER,
            toastId: networkError
          }
        );
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
      return <Landing props={props} />;
    } else if (location.pathname === "/tos") {
      return <ToS />;
    } else if (location.pathname === "/abount") {
      return <About />;
    } else if (location.pathname === "/faq") {
      return <FAQ />;
    } else if (location.pathname === "/privacy") {
      return <Privacy />;
    } else if (location.pathname === "/support") {
      return <Support />;
    }

    let showFooter =
      location.pathname && location.pathname.match(/^\/inbox/) === null;

    return (
      <div>
        <Body showFooter={showFooter} />
      </div>
    );
  } else {
    return null;
  }
});

const NavBarWithSession = withSession(Navbar);
const Body = ({ showFooter }) => (
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
      <NavBarWithSession ErrorHandler={ErrorHandler} />
    </header>
    <main style={{ display: "flex", flex: "3", flexDirection: "column" }}>
      <Switch>
        <Route
          path="/members"
          render={() => <ProfileSearch ErrorHandler={ErrorHandler} />}
          exact
        />
        <Route
          path="/events"
          render={() => <SearchEvents ErrorHandler={ErrorHandler} />}
          exact
        />
        <Route
          path="/event/:id"
          render={() => <EventPage ErrorHandler={ErrorHandler} />}
        />
        <Route
          path="/member/:id"
          render={() => <ProfilePage ErrorHandler={ErrorHandler} />}
        />
        <Route
          path="/inbox/:chatID"
          component={InboxPage}
          ErrorHandler={ErrorHandler}
        />
        <Route
          path="/inbox"
          component={InboxPage}
          ErrorHandler={ErrorHandler}
        />
        <Route
          path="/settings"
          render={() => <Settings ErrorHandler={ErrorHandler} />}
        />
        <Route
          path="/confirmation/:token"
          render={props => (
            <EmailConfirm ErrorHandler={ErrorHandler} {...props} />
          )}
        />
        <Route
          path="/phonereset/:token"
          render={props => (
            <PhoneConfirm ErrorHandler={ErrorHandler} {...props} />
          )}
        />
        <Redirect to="/" />
      </Switch>
    </main>
    {showFooter && <Footer />}
    <ToastContainer position="top-center" />
  </div>
);

render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById("root")
);
