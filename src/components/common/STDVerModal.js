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
        <p>
          STD Verification shows members you care about your health and theirs.
          We never share your results with anyone. Send us a copy of your most
          recent screening and valid identification. All verifications are valid
          6 months from your last appointment. Example: If you were last tested
          5 months ago your verification will last one month.
        </p>
      </Modal>
    );
  }
}

export default STDVerModal;
