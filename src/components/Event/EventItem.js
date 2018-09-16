import React from 'react';
import {Link} from 'react-router-dom';
const EventItem =({id,eventname})=>(
  <li><Link to={`/event/${id}`}>{eventname}</Link></li>
);

export default EventItem;
