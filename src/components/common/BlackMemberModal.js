import React, { Component } from "react";
import { Modal, Button } from "antd";
import CreateSubBtn from "../common/CreateSubBtn";

class BlackMemberModal extends Component {
  state = { token: "", ccLast4: "" };

  render() {
    const { visible, close, userID } = this.props;
    return (
      <Modal
        title={"Become a Black Member"}
        centered
        visible={visible}
        footer={[
          <Button key="submit" type="primary" onClick={close}>
            OK
          </Button>
        ]}
        onCancel={close}
      >
        <img
          alt="upload"
          style={{ width: "100%" }}
          src={require("../../images/girl2.jpg")}
        />
        <p>Coming soon.</p>
        <div>
          <h4>{userID}</h4>
        </div>
        <CreateSubBtn
          refetchUser={this.props.refetchUser}
          close={this.props.close}
        />
      </Modal>
    );
  }
}

export default BlackMemberModal;
