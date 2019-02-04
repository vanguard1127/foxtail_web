import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import Landing from './components/Landing';
import Navbar from './components/Navbar/';
import ProfileSearch from './components/SearchProfiles/';
import Settings from './components/Settings/';
import EventPage from './components/Event';
import ProfilePage from './components/Profile/';
import InboxPage from './components/Inbox/';
import SearchEvents from './components/SearchEvents';
import withSession from './components/withSession';
import './i18n';
import Footer from './components/Footer/';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

let server = 'localhost:4444';
//let server = "prod.foxtailapi.com";

// console.log(process.env.REACT_APP_LOCAL_SERVER);
// if (process.env.REACT_APP_LOCAL_SERVER === "true") {
//   server = ;
// }

let wsurl = `ws://${server}/subscriptions`;
let httpurl = `http://${server}/graphql`;
//let httpurl = `https://${server}/graphql`;
let HTTPSurl = `http://${server}`;
//let HTTPSurl = `https://${server}`;

const wsLink = new WebSocketLink({
  uri: wsurl,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken')
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
      authorization: `Bearer ${localStorage.getItem('token')}`,
      'x-refresh-token': localStorage.getItem('refreshToken')
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
      const token = headers.get('authorization');
      const refreshToken = headers.get('x-refresh-token');
      const lang = headers.get('lang');

      if (lang && lang !== undefined) {
        localStorage.setItem('i18nextLng', lang);
      }

      if (token && token !== undefined) {
        localStorage.setItem('token', token.replace('Bearer', '').trim());
      } else {
        localStorage.removeItem('token');
      }

      if (refreshToken && token !== refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
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
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithMiddleware
);

const cache = new InMemoryCache();

//DTODO:Do ii need rhtis
const defaultState = {
  profilePage: {
    __typename: 'ProfilePage',
    image: '123'
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
        if (~message.indexOf('Client')) {
          response.errors = null;
          alert(message.replace('Client:', '').trim());
          return null;
        } else if (~message.indexOf('authenticated')) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            return;
          }
          const axios = require('axios');
          console.log('TOKEN REFREHS');
          axios
            .post(HTTPSurl + '/refresh', {
              refreshToken
            })
            .then(function(response) {
              const newTokens = response.data;
              if (
                newTokens &&
                newTokens.token !== undefined &&
                newTokens.refresh !== undefined
              ) {
                localStorage.setItem('token', newTokens.token);
                localStorage.setItem('refreshToken', newTokens.refresh);
                operation.setContext(context => ({
                  ...context,
                  headers: {
                    ...context.headers,
                    authorization: `Bearer ${newTokens.token}`,
                    'x-refresh-token': newTokens.refresh
                  }
                }));
              } else {
                localStorage.removeItem('token');

                localStorage.removeItem('refreshToken');
              }

              return forward(operation);
            })
            .catch(function(error) {
              // handle error
              console.log('Token Refresh Error:', error);
            });
        } else {
          console.error(message);
          // popmsg.warn(
          //   "An error has occured. We will have it fixed soon. Thanks for your patience."
          // );
        }
        //TODO: Only allow this in dev mode
        // notification["error"]({
        //   message: "Oops an Error",
        //   placement: "bottomLeft",
        //   description: `Message: ${message}, Path: ${path}. Please report this issue so we can fix it.`
        // });
        return null;
      });
    //TODO:Decipher btwn 500 and 400 errors
    if (networkError) {
      console.error(networkError);
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
  let isLanding = location.pathname && location.pathname === '/';
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
//TODO:https://reacttraining.com/react-router/web/example/animated-transitions
class Body extends Component {
  render() {
    const { showFooter } = this.props;
    return (
      <div
        className="layout"
        style={{
          height: 'auto',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <header>
          <NavBarWithSession />
        </header>
        <main style={{ display: 'flex', flex: '3', flexDirection: 'column' }}>
          <Switch>
            <Route path="/members" component={ProfileSearch} exact />
            <Route path="/events" component={SearchEvents} exact />
            <Route path="/event/:id" component={EventPage} />
            <Route path="/member/:id" component={ProfilePage} />
            <Route path="/inbox/:chatID" component={InboxPage} />
            <Route path="/inbox" component={InboxPage} />
            <Route path="/settings" component={Settings} />

            <Redirect to="/" />
          </Switch>
        </main>
        {showFooter && <Footer />}
        <ToastContainer />
      </div>
    );
  }
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root')
);
