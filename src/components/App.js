import React from 'react';
import './App.css';

import {Query} from 'react-apollo';
import { SEARCH_EVENTS } from '../queries';
import EventItem from '../components/Event/EventItem';

const App = () => (
  <div className="App">
  <h1>Home</h1>
  <Query query={SEARCH_EVENTS} variables={{lat:23.00,long:73.00,desires:"M"}}>
    {({data,loading,error})=>{
      if(loading){
        return <div>Loading</div>}
      if(error){
        return <div>Error - Not Logged In</div>}

      console.log("HOME DATA:",data);

      return (
      <ul>{data.searchEvents.map(event => <EventItem key={event.id} {...event}/>)}</ul>
      );
    }}
  </Query>
  </div>
)

export default App;
