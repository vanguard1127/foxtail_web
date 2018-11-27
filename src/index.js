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

import { ApolloProvider } from "react-apollo";
import { Breadcrumb, Layout, message as popmsg } from "antd";
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
//http://develop-133124268.us-west-2.elb.amazonaws.com/graphql
// const wsurl =
//   "ws://production-151896178.us-west-2.elb.amazonaws.com/subscriptions";
// const httpurl =
//   "http://production-151896178.us-west-2.elb.amazonaws.com/graphql";
const wsurl = "ws://localhost:4444/subscriptions";
const httpurl = "http://localhost:4444/graphql";
const httpurlNonGraphQL = "http://localhost:4444";

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true
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
          const axios = require("axios");
          const refreshToken = localStorage.getItem("refreshToken");

          axios
            .post(httpurlNonGraphQL + "/refresh", {
              refreshToken
            })
            .then(function(response) {
              const newTokens = response.data;
              if (newTokens) {
                localStorage.setItem("token", newTokens.refresh);
                localStorage.setItem("refreshToken", newTokens.refresh);
                operation.setContext(context => ({
                  ...context,
                  headers: {
                    ...context.headers,
                    authorization: `Bearer ${newTokens.token}`,
                    "x-refresh-token": newTokens.refresh
                  }
                }));
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

const Root = ({ refetch, session }) => (
  <Router>
    <Wrapper refetch={refetch} session={session} />
  </Router>
);

const breadcrumbNameMap = {
  "/": "Home",
  "/members": "Search Members",
  "/events": "Search Events",
  "/editprofile": "Edit Profile",
  "/events/:id": "Event",
  "/chat/:id": "Chat Num",
  "/members/:id": "Profile Num",
  "/myaccount": "My Account"
};

const Wrapper = withRouter(props => {
  const { location, refetch, session } = props;
  const pathSnippets = location.pathname.split("/").filter(i => i);
  let breadcrumbItems;
  if (pathSnippets.length !== 0) {
    let directLink;
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      if (url === "/events") {
        directLink = "Event";
      }
      if (url === "/members") {
        directLink = "Profile";
      }
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {breadcrumbNameMap[url] ? breadcrumbNameMap[url] : directLink}
          </Link>
        </Breadcrumb.Item>
      );
    });
    breadcrumbItems = [<Breadcrumb.Item key="home" />].concat(
      extraBreadcrumbItems
    );
  } else {
    breadcrumbItems = null;
  }

  return (
    <div>
      <Body
        refetch={refetch}
        session={session}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
});

const Body = ({ refetch, session, breadcrumbItems }) => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Navbar session={session} />
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
      {breadcrumbItems && <Breadcrumb>{breadcrumbItems}</Breadcrumb>}
      <Switch>
        <Route path="/members" component={ProfileSearch} exact />
        <Route path="/" component={App} exact />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path="/events" component={SearchEvents} exact />
        <Route
          path="/editprofile"
          render={() => <EditProfile session={session} />}
        />
        <Route path="/events/:id" component={EventPage} />
        <Route path="/members/:id" component={ProfilePage} />
        <Route path="/inbox" component={InboxPage} />
        <Route path="/settings" render={() => <Settings session={session} />} />

        <Redirect to="/" />
      </Switch>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
