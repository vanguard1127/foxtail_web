import React, { Component } from "react";
import ProfileCard from "./ProfileCard";

class CardsList extends Component {
  state = {};

  render() {
    const { searchProfiles } = this.props;
    if (!searchProfiles) {
      return <div>Nothing</div>;
    }
    return (
      <div style={{ display: "flex" }}>
        {searchProfiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    );
  }
}

export default CardsList;
