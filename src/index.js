import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar/";
import ProfileSearch from "./components/SearchProfiles/";
import Settings from "./components/Settings/";
import EventPage from "./components/Event";
import ProfilePage from "./components/Profile/";
import InboxPage from "./components/Inbox/";
import SearchEvents from "./components/SearchEvents";
import ErrorBoundary from "./components/common/ErrorBoundary";
import withSession from "./components/withSession";
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

//FOR LOCAL
let server = "localhost:4444";
let httpurl = `http://${server}/graphql`;
let HTTPSurl = `http://${server}`;

//FOR DEV
// let server = "prod.foxtailapi.com";
// let httpurl = `https://${server}/graphql`;
// let HTTPSurl = `https://${server}`;

let wsurl = `ws://${server}/subscriptions`;

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

      if (lang && lang !== undefined) {
        localStorage.setItem("i18nextLng", lang);
      }

      if (token && token !== undefined) {
        localStorage.setItem("token", token.replace("Bearer", "").trim());
      } else {
        localStorage.removeItem("token");
      }

      if (refreshToken && token !== refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
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

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache
});

const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, path }) => {
        if (~message.indexOf("Client")) {
          toast.warn(message.replace("Client:", "").trim(), {
            position: toast.POSITION.TOP_CENTER
          });
          //TODO: prevent unhandled exception
          return null;
        } else if (~message.indexOf("authenticated")) {
          //TODO: Does this work?
          console.log("TOEKN");
          tokenHandler({ operation, forward, HTTPSurl });
        } else {
          console.error("APP ERROR:::", message);
        }
        return null;
      });
    }
    if (networkError) {
      //TODO:Decipher btwn 500 and 400 errors
      console.error("NETWORK:::", networkError);
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

//TODO:https://reacttraining.com/react-router/web/example/animated-transitions
const Wrapper = withRouter(props => {
  let location = props.location;
  let isLanding = location.pathname && location.pathname === "/";
  if (isLanding) {
    return <Landing />;
  }
  let showFooter =
    location.pathname && location.pathname.match(/^\/inbox/) === null;

  return (
    <div>
      <Body showFooter={showFooter} />
    </div>
  );
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
      <NavBarWithSession />
    </header>
    <main style={{ display: "flex", flex: "3", flexDirection: "column" }}>
      <Switch>
        <Route
          path="/members"
          render={() => <ProfileSearch ErrorBoundary={ErrorBoundary} />}
          exact
        />
        <Route
          path="/events"
          render={() => <SearchEvents ErrorBoundary={ErrorBoundary} />}
          exact
        />
        <Route
          path="/events/:id"
          render={() => <EventPage ErrorBoundary={ErrorBoundary} />}
        />
        <Route
          path="/members/:id"
          render={() => <ProfilePage ErrorBoundary={ErrorBoundary} />}
        />
        <Route path="/inbox/:chatID" component={InboxPage} />
        <Route path="/inbox" component={InboxPage} />
        <Route
          path="/settings"
          render={() => <Settings ErrorBoundary={ErrorBoundary} />}
        />

        <Redirect to="/" />
      </Switch>
    </main>
    {showFooter && <Footer />}
    <ToastContainer />
  </div>
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById("root")
);
