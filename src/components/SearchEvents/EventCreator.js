import React from "react";
import { withRouter } from "react-router-dom";
const preventContextMenu = e => {
  e.preventDefault();
  alert(
    "Right-click disabled: Saving images on Foxtail will result in your account being banned."
  );
};
const EventCreator = ({ ownerProfile, history }) => {
  return (
    <div className="created">
      <span onClick={() => history.push("/members/" + ownerProfile.id)}>
        <span className="avatar">
          <img
            src={
              ownerProfile.profilePic !== ""
                ? ownerProfile.profilePic
                : "assets/img/usr/avatar/1002@2x.png"
            }
            alt=""
            onContextMenu={preventContextMenu}
          />
        </span>
        <span className="name">{ownerProfile.profileName}</span>
      </span>
    </div>
  );
};

export default withRouter(EventCreator);
