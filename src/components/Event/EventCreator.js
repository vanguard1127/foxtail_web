import React from "react";
import moment from "moment";
const EventCreator = ({ ownerProfile, createdAt, history }) => {
  return (
    <div className="created">
      <span onClick={() => history.push("/members/" + ownerProfile.id)}>
        <span className="avatar">
          <img
            src={
              ownerProfile.profilePic !== ""
                ? ownerProfile.profilePic
                : "/assets/img/usr/avatar/1003@2x.png"
            }
            alt=""
          />
        </span>
        <div className="detail">
          <span className="name">{ownerProfile.profileName}</span>
          <span className="created-date">
            Created on{" "}
            {moment(createdAt)
              .format("MMM Do")
              .toString()}
          </span>
        </div>
      </span>
    </div>
  );
};

export default EventCreator;
