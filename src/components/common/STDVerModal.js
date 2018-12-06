import React, { Component } from "react";
import { Modal, Button } from "antd";

class STDVerModal extends Component {
  render() {
    const { visible, close, userID } = this.props;
    return (
      <Modal
        title={"Submit STD Results"}
        centered
        visible={visible}
        footer={[
          <Button key="submit" type="primary" onClick={close}>
            OK
          </Button>
        ]}
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
      </Modal>
    );
  }
}

export default STDVerModal;
