import React, { Component } from "react";
import { Modal, message, Input } from "antd";
import { SEND_MESSAGE } from "../../queries";
import { Mutation } from "react-apollo";

class DirectMsgModal extends Component {
  state = { text: "" };

  handleTextChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = sendMessage => {
    sendMessage()
      .then(async ({ data }) => {
        if (data.sendMessage) {
          message.success("Message Sent");
          this.props.close();
        } else {
          message.error("Message not sent.");
        }
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  render() {
    const { visible, close, profile } = this.props;

    const { text } = this.state;
    return (
      <Mutation
        mutation={SEND_MESSAGE}
        variables={{
          text,
          invitedProfile: profile.id
        }}
      >
        {(sendMessage, { loading, error }) => {
          return (
            <Modal
              title={"Send Message to " + profile.profileName}
              centered
              visible={visible}
              onOk={() => this.handleSubmit(sendMessage)}
              onCancel={close}
              okButtonProps={{ disabled: loading }}
            >
              <Input
                placeholder={"Write Message Here..."}
                value={text}
                onChange={this.handleTextChange}
              />
            </Modal>
          );
        }}
      </Mutation>
    );
  }
}

export default DirectMsgModal;
