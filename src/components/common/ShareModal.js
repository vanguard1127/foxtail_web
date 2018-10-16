import React, { Component } from "react";
import { Modal } from "antd";

class ShareModal extends Component {
  body = () => {
    const { profile } = this.props;
    if (profile) {
      return (
        <div>
          Know someone that would like to meet{" "}
          {profile.users.map((user, index) => {
            if (index === 0) return user.username;
            else return +" & " + user.username;
          })}
          ?
        </div>
      );
    } else {
      return <div>share this event?</div>;
    }
  };
  render() {
    const { visible, close } = this.props;
    const modalBody = this.body();
    return (
      <Modal centered visible={visible} onOk={close} onCancel={close}>
        {modalBody}
      </Modal>
    );
  }
}

export default ShareModal;
