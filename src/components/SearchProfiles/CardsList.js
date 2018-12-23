import React, { Component } from "react";
import ProfileCard from "./ProfileCard";
import BlockModal from "../common/BlockModal";
import ShareModal from "../common/ShareModal";
import DirectMsgModal from "../common/DirectMsgModal";

class CardsList extends Component {
  state = {
    shareModalVisible: false,
    blockModalVisible: false,
    msgModalVisible: false,
    profile: ""
  };

  setMsdModalVisible = (msgModalVisible, profile) => {
    if (profile) this.setState({ profile, msgModalVisible });
    else this.setState({ msgModalVisible });
  };

  setShareModalVisible = (shareModalVisible, profile) => {
    if (profile) this.setState({ profile, shareModalVisible });
    else this.setState({ shareModalVisible });
  };

  setBlockModalVisible = (blockModalVisible, profile) => {
    if (profile) this.setState({ profile, blockModalVisible });
    else this.setState({ blockModalVisible });
  };

  render() {
    const {
      profile,
      blockModalVisible,
      shareModalVisible,
      msgModalVisible
    } = this.state;

    const { showImageModal, searchProfiles } = this.props;

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
          visible={blockModalVisible}
          close={() => this.setBlockModalVisible(false)}
          removeProfile={this.removeProfile}
        />
        <ShareModal
          profile={profile}
          visible={shareModalVisible}
          close={() => this.setShareModalVisible(false)}
        />
        <DirectMsgModal
          profile={profile}
          visible={msgModalVisible}
          close={() => this.setMsdModalVisible(false)}
        />
        {searchProfiles.featuredProfiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            showBlockModal={this.setBlockModalVisible}
            showShareModal={this.setShareModalVisible}
            showMsgModal={this.setMsdModalVisible}
            showImageModal={showImageModal}
          />
        ))}
        {searchProfiles.profiles.map(profile => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            showBlockModal={this.setBlockModalVisible}
            showShareModal={this.setShareModalVisible}
            showMsgModal={this.setMsdModalVisible}
            showImageModal={showImageModal}
          />
        ))}
      </div>
    );
  }
}

export default CardsList;
