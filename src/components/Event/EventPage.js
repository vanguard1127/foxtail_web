import React from 'react';
import {withRouter} from 'react-router-dom';
import {Query} from 'react-apollo';
import {GET_EVENT} from '../../queries';

const EventPage =({match})=>{
  const {id}=match.params;
  return(
    <Query query={GET_EVENT} variables={{id}}>
    {({data,loading,error})=>{
       if(loading){
        return <div>Loading</div>}
      if(error){
        return <div>Error</div>}
        console.log(data);

      return(
        <div className="App">
        <h2>{data.event.eventname}</h2>
        <p>{data.event.time}</p>
        <button>Join</button>
        </div>
      );
    }}

  </Query>
  );
};

export default withRouter(EventPage);
