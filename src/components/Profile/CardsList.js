import React, { Component } from "react";
import ProfileCard from "./ProfileCard";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";

class CardsList extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    profile: "",
    searchProfiles: []
  };

  setShareModalVisible = (shareModalVisible, profile) => {
    if (profile) this.setState({ profile, shareModalVisible });
    else this.setState({ shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    if (profile) this.setState({ profile, blockModalVisible });
    else this.setState({ blockModalVisible });
  };

  removeProfile = id => {
    this.setState(prevState => ({
      searchProfiles: this.props.searchProfiles.filter(el => el.id !== id)
    }));
  };

  componentWillMount() {
    this.setState({ searchProfiles: this.props.searchProfiles });
  }

  render() {
    const { searchProfiles, profile } = this.state;

    if (!searchProfiles) {
      return <div>No one near you. Check back later</div>;
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
          id={profile.id}
          visible={this.state.blockModalVisible}
          close={() => this.setBlockModalVisible(false)}
          removeProfile={this.removeProfile}
        />
        <ShareModal
          profile={profile}
          visible={this.state.shareModalVisible}
          close={() => this.setShareModalVisible(false)}
        />
        {searchProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            showBlockModal={this.setBlockModalVisible}
            showShareModal={this.setShareModalVisible}
          />
        ))}
      </div>
    );
  }
}

export default CardsList;
