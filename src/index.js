import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import "./index.css";
import App from "./components/App";
import Navbar from "./components/Navbar";
import ProfileSearch from "./components/Profile/ProfileSearch";
import Settings from "./components/Account/Settings";
import EventPage from "./components/Event/EventPage";
import ProfilePage from "./components/Profile/ProfilePage";
import InboxPage from "./components/Inbox/InboxPage";
import SearchEvents from "./components/Event/SearchEvents";
import EditProfile from "./components/EditProfile/EditProfilePage";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import Footer from "./components/Footer";
import "./i18n";

import { ApolloProvider } from "react-apollo";
import { Layout, message as popmsg } from "antd";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";
import { notification } from "antd";

const { Header, Content } = Layout;

let wsurl;
let httpurl;
let httpurlNonGraphQL;
if (process.env.NODE_ENV === "production") {
  wsurl = "ws://production-151896178.us-west-2.elb.amazonaws.com/subscriptions";
  httpurl = "http://production-151896178.us-west-2.elb.amazonaws.com/graphql";
  httpurlNonGraphQL = "http://production-151896178.us-west-2.elb.amazonaws.com";
} else {
  wsurl = "ws://localhost:4444/subscriptions";
  httpurl = "http://localhost:4444/graphql";
  httpurlNonGraphQL = "http://localhost:4444";
}

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken")
    }
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

const defaultState = {
  profilePage: {
    __typename: "ProfilePage",
    image: "123"
  }
};

const stateLink = withClientState({
  cache,
  defaults: defaultState
});

//TODO: find what used the UNAUTH erro and remvoe that package
const errorLink = onError(
  ({ graphQLErrors, networkError, response, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, path }) => {
        if (~message.indexOf("Client")) {
          response.errors = null;
          popmsg.warn(message.replace("Client:", "").trim());
          return null;
        } else if (~message.indexOf("authenticated")) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            return;
          }
          const axios = require("axios");
          console.log("TOKEN REFREHS");
          axios
            .post(httpurlNonGraphQL + "/refresh", {
              refreshToken
            })
            .then(function(response) {
              const newTokens = response.data;
              if (
                newTokens &&
                newTokens.token !== undefined &&
                newTokens.refresh !== undefined
              ) {
                localStorage.setItem("token", newTokens.token);
                localStorage.setItem("refreshToken", newTokens.refresh);
                operation.setContext(context => ({
                  ...context,
                  headers: {
                    ...context.headers,
                    authorization: `Bearer ${newTokens.token}`,
                    "x-refresh-token": newTokens.refresh
                  }
                }));
              } else {
                localStorage.removeItem("token");

                localStorage.removeItem("refreshToken");
              }

              return forward(operation);
            })
            .catch(function(error) {
              // handle error
              console.log("Token Refresh Error:", error);
            });
        } else {
          popmsg.warn(
            "An error has occured. We will have it fixed soon. Thanks for your patience."
          );
        }
        //TODO: Only allow this in dev mode
        notification["error"]({
          message: "Oops an Error",
          placement: "bottomLeft",
          description: `Message: ${message}, Path: ${path}. Please report this issue so we can fix it.`
        });
        return null;
      });
    //TODO:Decipher btwn 500 and 400 errors
    if (networkError)
      notification["warn"]({
        message: "Check you network",
        placement: "bottomLeft",
        description: `[Network error]: ${networkError}`
      });
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
  return (
    <div>
      <Body />
    </div>
  );
});

const NavBarWithSession = withSession(Navbar);

const Body = () => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <NavBarWithSession />
    </Header>
    <Content
      style={{
        padding: "0 50px",
        minHeight: "86vh",
        display: "flex",
        flex: "1",
        flexDirection: "column"
      }}
    >
      <Switch>
        <Route path="/members" component={ProfileSearch} exact />
        <Route path="/" component={App} exact />
        <Route path="/signup" component={Signup} />
        <Route path="/events" component={SearchEvents} exact />
        <Route path="/editprofile/:couple" component={EditProfile} />
        <Route path="/editprofile" component={EditProfile} />
        <Route path="/events/:id" component={EventPage} />
        <Route path="/members/:id" component={ProfilePage} />
        <Route path="/inbox" component={InboxPage} />
        <Route path="/settings" component={Settings} />

        <Redirect to="/" />
      </Switch>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById("root")
);
