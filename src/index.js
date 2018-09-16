import React,{Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route,Switch,Redirect} from 'react-router-dom';
import './index.css';
import App from './components/App';
import Navbar from './components/Navbar';
import Search from './components/Profile/Search';
import Profile from './components/Profile/Profile';
import AddEvent from './components/Event/AddEvent';
import EventPage from './components/Event/EventPage';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import withSession from './components/withSession';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

const client=new ApolloClient({
  uri:'http://localhost:4444/graphql',
  fetchOptions:{
    credentials:'include'
  },
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers:{
        Authorization:"Bearer "+token
      }
    })
  },
  onError: ({networkError})=> {
    if(networkError){
      console.log('Network Error:::',networkError);

      //TODO: what to do with errors here
      // if(networkError.statusCode === 401){
      //   localStorage.removeItem('token');
      // }
    }
  }
});

const Root=({refetch,session})=>(
  <Router>
    <Fragment>
    <Navbar session={session}/>
    <Switch>
      <Route path="/" component={App} exact />
      <Route path="/search" component={Search} />
      <Route path="/signin" render={()=><Signin refetch={refetch}/>}/>
      <Route path="/signup" render={()=><Signup refetch={refetch}/>}/>
      <Route path="/event/add" render={()=> <AddEvent session={session}/>} />
      <Route path="/event/:id" component={EventPage} />
      <Route path="/profile" component={Profile} />
      <Redirect to="/"/>
    </Switch>
    </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
<ApolloProvider client={client}>
<RootWithSession />
</ApolloProvider>, document.getElementById('root')
);
