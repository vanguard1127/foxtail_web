import React, { Component } from "react";
import { Modal, Button } from "antd";

import StripeCheckout from "react-stripe-checkout";

class BlackMemberModal extends Component {
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
        <StripeCheckout
          token={token => console.log(token)}
          stripeKey={process.env.STRIPE_PUBLIC_KEY}
        />
      </Modal>
    );
  }
}

export default BlackMemberModal;
