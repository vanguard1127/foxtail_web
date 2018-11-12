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
//import App from "./components/Test";
import Navbar from "./components/Navbar";
import ProfileSearch from "./components/Profile/ProfileSearch";
import Settings from "./components/Account/Settings";
import EventPage from "./components/Event/EventPage";
import ProfilePage from "./components/Profile/ProfilePage";
import ChatPage from "./components/Chat/ChatPage";
import InboxPage from "./components/Inbox/InboxPage";
import SearchEvents from "./components/Event/SearchEvents";
import EditProfile from "./components/EditProfile/EditProfilePage";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import Footer from "./components/Footer";

import { ApolloProvider } from "react-apollo";
import { Breadcrumb, Layout } from "antd";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { withClientState } from "apollo-link-state";

const { Header, Content } = Layout;
//http://develop-133124268.us-west-2.elb.amazonaws.com/graphql
const wsurl =
  "ws://production-151896178.us-west-2.elb.amazonaws.com/subscriptions";
const httpurl =
  "http://production-151896178.us-west-2.elb.amazonaws.com/graphql";
// const wsurl = "ws://localhost:4444/subscriptions";
// const httpurl = "http://localhost:4444/graphql";

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
  const token = localStorage.getItem("token");

  operation.setContext(context => ({
    ...context,
    headers: {
      ...context.headers,
      authorization: `Bearer ${token}`
    }
  }));

  return forward(operation);
});

const splitlink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
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

const link = ApolloLink.from([stateLink, AuthLink, splitlink]);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent

const client = new ApolloClient({
  link,
  cache,
  onError: ({ networkError }) => {
    if (networkError) {
      console.log("Network Error:::", networkError);

      //TODO: what to do with errors here
      // if(networkError.statusCode === 401){
      //   localStorage.removeItem('token');
      // }
    }
  }
});

const Root = ({ refetch, session }) => (
  <Router>
    <Wrapper refetch={refetch} session={session} />
  </Router>
);

const breadcrumbNameMap = {
  "/": "Home",
  "/signup": "Sign-Up",
  "/members": "Search Members",
  "/events": "Search Events",
  "/signin": "Sign-In",
  "/editprofile": "Edit Profile",
  "/events/:id": "Event",
  "/chat/:id": "Chat Num",
  "/profile/:id": "Profile Num",
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
        <Route path="/" component={App} exact />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path="/members" component={ProfileSearch} exact />
        <Route path="/events" component={SearchEvents} exact />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route
          path="/editprofile"
          render={() => <EditProfile session={session} />}
        />
        <Route path="/events/:id" component={EventPage} />
        <Route path="/members/:id" component={ProfilePage} />
        <Route path="/chat/:id" component={ChatPage} />
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
