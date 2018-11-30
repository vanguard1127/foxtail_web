import React, { Component } from "react";
import { Modal, Select, Input, message } from "antd";
import { BLOCK_PROFILE, FLAG_ITEM } from "../../queries";
import { Mutation } from "react-apollo";
const Option = Select.Option;

class BlockModal extends Component {
  state = { other: false, reason: "", type: "" };

  handleChange = value => {
    this.setType();
    if (value === "other") {
      this.setState({ other: true, reason: "" });
    } else {
      this.setState({ reason: value, other: false });
    }
  };

  handleTextChange = event => {
    this.setState({ reason: event.target.value });
  };

  setType = () => {
    let type;
    if (this.props.profile) {
      type = "Profile";
    } else if (this.props.event) {
      type = "Event";
    }
    this.setState({ type });
  };

  //TODO:Finish BLock
  handleSubmit = (blockProfile, flagItem) => {
    flagItem()
      .then(({ data }) => {
        this.props.close();
      })
      .then(() => {
        if (this.props.profile) {
          const { id } = this.props.profile;
          blockProfile().then(({ data }) => {
            if (data.blockProfile) {
              message.success("Selected profile has been reported. Thanks.");
              this.props.removeProfile(id);
            }
          });
        }
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  };

  menu = () => {
    if (this.props.profile) {
      return (
        <Select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <Option value="">Select Reason:</Option>
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
    } else {
      return (
        <Select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <Option value="">Select Reason:</Option>
          <Option value="illegalEvent">Illegal Event</Option>
          <Option value="racist">Racist</Option>
          <Option value="Spam">Spam</Option>
          <Option value="Phishing">Phishing</Option>
        </Select>
      );
    }
  };

  render() {
    const { profile, visible, close, id } = this.props;

    const { other, reason, type } = this.state;
    const blockMenu = this.menu();

    return (
      <Mutation
        mutation={FLAG_ITEM}
        variables={{
          type,
          reason,
          targetID: id
        }}
      >
        {flagItem => {
          return (
            <Mutation
              mutation={BLOCK_PROFILE}
              variables={{
                blockedProfileID: id
              }}
            >
              {(blockProfile, { loading }) => {
                if (loading) {
                  //TODO: Make nice popup saving
                  return <div>SAVING...</div>;
                }
                return (
                  <Modal
                    title={
                      profile
                        ? "Report/Block " +
                          profile.users.map((user, index) => {
                            if (index === 0) return user.username;
                            else return +" & " + user.username;
                          }) +
                          "?"
                        : "Report"
                    }
                    centered
                    visible={visible}
                    onOk={() => this.handleSubmit(blockProfile, flagItem)}
                    onCancel={close}
                    okButtonProps={{ disabled: reason === "" || loading }}
                  >
                    Select a Reason: {blockMenu}
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
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default BlockModal;
