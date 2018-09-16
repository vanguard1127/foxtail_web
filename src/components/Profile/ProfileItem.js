import React from 'react';
import {Link} from 'react-router-dom';
const ProfileItem =({id,profilename})=>(
  <li><Link to={`/profile/${id}`}>{profilename}</Link></li>
);

export default ProfileItem;
