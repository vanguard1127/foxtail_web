import React from "react";
import { withRouter } from "react-router-dom";
const EventCreator = ({ ownerProfile, id }) => {
  return (
    <div className="created">
      <a href={null} onClick={() => this.props.history.push("/events/" + id)}>
        <span className="avatar">
          <img
            src={
              ownerProfile.profilePic !== ""
                ? ownerProfile.profilePic
                : "assets/img/usr/avatar/1002@2x.png"
            }
            alt=""
          />
        </span>
        <span className="name">{ownerProfile.profileName}</span>
      </a>
    </div>
  );
};

export default withRouter(EventCreator);
