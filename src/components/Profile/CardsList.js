import React, { Component } from "react";
import ProfileCard from "./ProfileCard";
import BlockModal from "../common/BlockModal";
import ProfileModal from "../common/ProfileModal";

class CardsList extends Component {
  state = {
    searchProfiles: this.props.searchProfiles,
    profileModalVisible: false,
    blockModalVisible: false,
    profile: ""
  };

  setProfileModalVisible = (profileModalVisible, profile) => {
    console.log("attemo");
    this.setState({ profile, profileModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    this.setState({ profile, blockModalVisible });
  };

  removeProfile = id => {
    this.setState(prevState => ({
      searchProfiles: prevState.searchProfiles.filter(el => el.id !== id)
    }));
  };

  render() {
    const { searchProfiles, profile } = this.state;
    if (!searchProfiles) {
      return <div>Nothing</div>;
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        <BlockModal
          profile={profile}
          visible={this.state.blockModalVisible}
          close={() => this.setBlockModalVisible(false)}
          removeProfile={this.removeProfile}
        />
        <ProfileModal
          profile={profile}
          visible={this.state.profileModalVisible}
          close={() => this.setProfileModalVisible(false)}
          removeProfile={this.removeProfile}
        />

        {searchProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            removeProfile={this.removeProfile}
            showBlockModal={this.setBlockModalVisible}
            showProfileModal={this.setProfileModalVisible}
          />
        ))}
      </div>
    );
  }
}

export default CardsList;
