import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Link, Redirect, Route, Switch, withRouter } from "react-router-dom";
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
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Breadcrumb, Layout } from "antd";
import { Provider } from "react-redux";
import configureStore from "redux/configureStore";

const store = configureStore();

const { Header, Content } = Layout;
//http://develop-133124268.us-west-2.elb.amazonaws.com/graphql
const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        Authorization: "Bearer " + token
      }
    });
  },
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
    <Content style={{ padding: "0 50px" }}>
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
  <Provider store={store}>
    <ApolloProvider client={client}>
      <RootWithSession />
    </ApolloProvider>
  </Provider>,
  document.getElementById("root")
);
