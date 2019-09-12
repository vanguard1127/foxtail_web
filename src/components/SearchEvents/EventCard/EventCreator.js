import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { preventContextMenu } from "../../../utils/image";

class EventCreator extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { ownerProfile } = this.props;
    return (
      <div className="created">
        <span>
          <span className="avatar">
            <img
              src={
                ownerProfile.profilePic !== ""
                  ? ownerProfile.profilePic
                  : "assets/img/elements/no-profile.png"
              }
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <span className="name">{ownerProfile.profileName}</span>
        </span>
      </div>
    );
  }
}

export default withRouter(EventCreator);
