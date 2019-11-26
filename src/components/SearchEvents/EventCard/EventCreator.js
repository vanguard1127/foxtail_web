import React, { Component } from "react";
import { withRouter } from "react-router-dom";

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
            />
          </span>
          <span className="name" title={ownerProfile.profileName}>
            {ownerProfile.profileName}
          </span>
        </span>
      </div>
    );
  }
}

export default withRouter(EventCreator);
