import React, { Component } from "react";
import { BLOCK_PROFILE, FLAG_ITEM } from "../../../queries";
import { Mutation } from "react-apollo";

export default class BlockModal extends Component {
  state = { other: false, reason: "", type: this.props.type };

  handleChange = e => {
    if (e.target.value === "other") {
      this.setState({ other: true, reason: "" });
    } else {
      this.setState({ reason: e.target.value, other: false });
    }
  };

  handleTextChange = event => {
    this.setState({ reason: event.target.value });
  };

  handleSubmit = (blockProfile, flagItem) => {
    flagItem()
      .then(({ data }) => {
        this.props.close();
      })
      .then(() => {
        if (this.state.type === "Profile") {
          blockProfile().then(({ data }) => {
            if (data.blockProfile) {
              // message.success("Selected profile has been reported. Thanks.");
              this.props.goToMain();
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
    if (this.state.type === "Profile") {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="">Select Reason:</option>
          <option value="nopro">No Profile Picture</option>
          <option value="stolenPic">Stolen Picture</option>
          <option value="money">Mentions Money</option>
          <option value="nudity">Nudity</option>
          <option value="rude">Rude</option>
          <option value="Spam">Spam</option>
          <option value="racist">Racist</option>
          <option value="other">Other</option>
        </select>
      );
    } else {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="">Select Reason:</option>
          <option value="illegalEvent">Illegal Event</option>
          <option value="racist">Racist</option>
          <option value="Spam">Spam</option>
          <option value="Phishing">Phishing</option>
        </select>
      );
    }
  };
  render() {
    const { profile, close, id } = this.props;

    const { other, reason, type } = this.state;
    const blockMenu = this.menu();
    let title;
    if (type === "Profile") {
      title =
        "Report/Block " +
        profile.users.map((user, index) => {
          if (index === 0) return user.username;
          else return +" & " + user.username;
        });
    } else {
      title = "Report/Block";
    }
    return (
      <section className="popup-content show">
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="modal-popup photo-verification">
                  <div className="m-head">
                    <span className="heading">{title}</span>
                    <a className="close" onClick={close} />
                  </div>
                  <div className="m-body">
                    {blockMenu}
                    <div
                      style={{
                        display: other ? "block" : "none"
                      }}
                    >
                      <input
                        placeholder="Other reason"
                        onChange={this.handleTextChange}
                        value={reason}
                      />
                    </div>
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
                                <button
                                  onClick={() =>
                                    this.handleSubmit(blockProfile, flagItem)
                                  }
                                  disabled={reason === "" || loading}
                                >
                                  Report/Block
                                </button>
                              );
                            }}
                          </Mutation>
                        );
                      }}
                    </Mutation>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
