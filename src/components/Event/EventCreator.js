import React from "react";
import moment from "moment";
const EventCreator = ({ ownerProfile, createdAt }) => {
  return (
    <div className="created">
      <span className="avatar">
        <a href="#">
          <img
            src={
              ownerProfile.profilePic !== ""
                ? ownerProfile.profilePic
                : "/assets/img/usr/avatar/1003@2x.png"
            }
            alt=""
          />
        </a>
      </span>
      <div className="detail">
        <span className="name">
          <a href="#">{ownerProfile.profileName}</a>
        </span>
        <span className="created-date">
          Created on{" "}
          {moment(createdAt)
            .format("MMM Do")
            .toString()}
        </span>
      </div>
    </div>
  );
};

export default EventCreator;
