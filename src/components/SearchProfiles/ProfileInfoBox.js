import React, { Component } from "react";
import moment from "moment";
import TimeAgo from "../../utils/TimeAgo";

const ProfileInfoBox = ({ users, lastOnline }) => {
  let online = "";
  if (lastOnline) {
    online = TimeAgo(lastOnline);
    if (online === "Online") {
      online = "online";
    }
  }
  return (
    <div>
      <span className={"name " + online}>
        {users[0].username}
        {users[1] && "&" + users[1].username}
      </span>
      <span className="detail">
        <ul>
          <li className={"gender " + users[0].gender}>
            {moment().diff(users[0].dob, "years")}
          </li>
          {users[1] && (
            <li className={"gender " + users[1].gender}>
              {moment().diff(users[1].dob, "years")}
            </li>
          )}
          <li>~ 8.4 mil</li>
        </ul>
      </span>
    </div>
  );
};

export default ProfileInfoBox;
