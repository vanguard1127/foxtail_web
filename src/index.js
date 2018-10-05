import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./index.css";
import App from "./components/App";
//import App from "./components/Test";
import Navbar from "./components/Navbar";
import ProfileSearch from "./components/Profile/ProfileSearch";
import Account from "./components/Account/AccountPage";
import AddEvent from "./components/Event/AddEvent";
import EventPage from "./components/Event/EventPage";
import ProfilePage from "./components/Profile/ProfilePage";
import ChatPage from "./components/Chat/ChatPage";
import SearchEvents from "./components/Event/SearchEvents";
import EditProfile from "./components/EditProfile/EditProfilePage";
import SearchDesire from "./components/Desire/DesireSearch";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

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
    <div className="wrapper">
      <div className="logo">
        <img alt="Foxtail" src={require("../src/images/logoWords_red.png")} />
      </div>
      <Navbar session={session} />
      <article className="main">
        <Switch>
          <Route path="/" component={App} exact />
          <Route path="/signup" render={() => <Signup refetch={refetch} />} />
          <Route path="/search" component={ProfileSearch} />
          <Route path="/event/search" component={SearchEvents} />
          <Route path="/signin" render={() => <Signin refetch={refetch} />} />
          <Route
            path="/editprofile"
            render={() => <EditProfile session={session} />}
          />
          <Route
            path="/event/add"
            render={() => <AddEvent session={session} />}
          />
          <Route path="/event/:id" component={EventPage} />
          <Route path="/profile/:id" component={ProfilePage} />
          <Route path="/chat/:id" component={ChatPage} />
          <Route
            path="/myaccount"
            render={() => <Account session={session} />}
          />
          <Route path="/desire/search" component={SearchDesire} />
          <Redirect to="/" />
        </Switch>
      </article>
      <footer className="footer">Foxtail</footer>
    </div>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
