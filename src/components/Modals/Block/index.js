import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { BLOCK_PROFILE, FLAG_ITEM } from "../../../queries";
import { Mutation } from "react-apollo";

class BlockModal extends Component {
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
    const { t } = this.props;
    if (this.state.type === "Profile") {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="">{t("Select Reason")}:</option>
          <option value="nopro">{t("No Profile Picture")}</option>
          <option value="stolenPic">{t("Stolen Picture")}</option>
          <option value="money">{t("Mentions Money")}</option>
          <option value="nudity">{t("Nudity")}</option>
          <option value="rude">{t("Rude")}</option>
          <option value="Spam">{t("Spam")}</option>
          <option value="racist">{t("Racist")}</option>
          <option value="other">{t("Other")}</option>
        </select>
      );
    } else {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="">{t("Select Reason")}:</option>
          <option value="illegalEvent">{t("Illegal Event")}</option>
          <option value="racist">{t("Racist")}</option>
          <option value="Spam">{t("Spam")}</option>
          <option value="Phishing">{t("Phishing")}</option>
        </select>
      );
    }
  };
  render() {
    const { profile, close, id, t } = this.props;

    const { other, reason, type } = this.state;
    const blockMenu = this.menu();
    let title;
    if (type === "Profile") {
      title =
        t("Report/Block") +
        " " +
        profile.users.map((user, index) => {
          if (index === 0) return user.username;
          else return +" & " + user.username;
        });
    } else {
      title = t("Report/Block");
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
                    <span className="close" onClick={close} />
                  </div>
                  <div className="m-body">
                    {blockMenu}
                    <div
                      style={{
                        display: other ? "block" : "none"
                      }}
                    >
                      <input
                        placeholder={t("Other reason")}
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
                                return <div>{t("Saving")}...</div>;
                              }
                              return (
                                <button
                                  onClick={() =>
                                    this.handleSubmit(blockProfile, flagItem)
                                  }
                                  disabled={reason === "" || loading}
                                >
                                  {t("Report/Block")}
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

export default withNamespaces()(BlockModal);
