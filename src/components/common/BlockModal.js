import React, { Component } from "react";
import { Modal, Select, Input } from "antd";
import { BLOCK_PROFILE } from "../../queries";
import { Mutation } from "react-apollo";
const Option = Select.Option;

class BlockModal extends Component {
  state = { other: false, reason: "" };

  handleChange = value => {
    if (value === "other") {
      this.setState({ other: true, reason: "" });
    } else {
      this.setState({ reason: value, other: false });
    }
  };

  handleTextChange = event => {
    this.setState({ reason: event.target.value });
  };

  handleSubmit = blockProfile => {
    const { id } = this.props.profile;
    blockProfile()
      .then(({ data }) => {
        console.log("inside", data);
        this.props.removeProfile(id);
        this.props.close();
      })
      .catch(e => console.log(e.message));
  };

  menu = (
    <Select
      defaultValue="nudity"
      style={{ display: "flex", flex: "1", margin: "10px" }}
      onChange={this.handleChange}
    >
      <Option value="nopro">No Profile Picture</Option>
      <Option value="stolenPic">Stolen Picture</Option>
      <Option value="money">Mentions Money</Option>
      <Option value="nudity">Nudity</Option>
      <Option value="rude">Rude</Option>
      <Option value="Spam">Spam</Option>
      <Option value="racist">Racist</Option>
      <Option value="other">Other</Option>
    </Select>
  );

  render() {
    const { profile, visible, close } = this.props;
    const { other, reason } = this.state;
    if (!profile) {
      return <span />;
    }
    return (
      <Mutation
        mutation={BLOCK_PROFILE}
        variables={{
          blockedProfileID: profile.id
        }}
      >
        {(blockProfile, { data, loading, error }) => (
          <Modal
            title={
              profile &&
              "Report/Block " +
                profile.users.map((user, index) => {
                  if (index === 0) return user.username;
                  else return +" & " + user.username;
                }) +
                "?"
            }
            centered
            visible={visible}
            onOk={() => this.handleSubmit(blockProfile)}
            onCancel={close}
          >
            Select a Reason: {this.menu}
            <div
              style={{
                display: other ? "block" : "none"
              }}
            >
              <Input
                placeholder="Basic usage"
                onChange={this.handleTextChange}
                value={reason}
              />
            </div>
          </Modal>
        )}
      </Mutation>
    );
  }
}

export default BlockModal;
