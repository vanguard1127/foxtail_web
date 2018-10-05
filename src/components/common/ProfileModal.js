import React, { Component } from "react";
import { Modal } from "antd";
import ProfileCard from "../Profile/ProfileCard";

class ProfileModal extends Component {
  render() {
    const { profile, visible, close } = this.props;
    if (!profile) {
      return <span />;
    }
    return (
      <Modal centered visible={visible} onOk={close} onCancel={close}>
        <ProfileCard
          key={profile.id}
          profile={profile}
          removeProfile={this.removeProfile}
        />
      </Modal>
    );
  }
}

export default ProfileModal;
