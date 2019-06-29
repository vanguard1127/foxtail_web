import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { BLOCK_PROFILE, FLAG_ITEM, SEARCH_PROFILES } from "../../../queries";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import Modal from "../../common/Modal";
import { flagOptions } from "../../../docs/options";

class BlockModal extends Component {
  state = { other: false, reason: "nopro", type: this.props.type };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.reason !== nextState.reason ||
      this.state.other !== nextState.other ||
      this.props.t !== nextProps.t
    ) {
      return true;
    }
    return false;
  }

  handleChange = e => {
    if (this.mounted) {
      if (e.target.value === "other") {
        this.setState({ other: true, reason: "" });
      } else {
        this.setState({ reason: e.target.value, other: false });
      }
    }
  };

  handleTextChange = event => {
    if (this.mounted) {
      this.setState({ reason: event.target.value });
    }
  };

  handleSubmit = (blockProfile, flagItem) => {
    const { t, close, goToMain, ErrorHandler } = this.props;
    flagItem()
      .then(() => {
        if (this.state.type === flagOptions.Profile) {
          blockProfile().then(({ data }) => {
            if (data.blockProfile) {
              toast.success(t("selproreported"));
              goToMain();
            }
          });
        } else if (this.state.type === flagOptions.Chat) {
          toast.success(t("chatreported"));
          close();
        } else if (this.state.type === flagOptions.Event) {
          toast.success(t("evereported"));
          close();
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  menu = () => {
    const { t } = this.props;
    if (this.state.type === flagOptions.Profile) {
      return (
        <select
          defaultValue="nopro"
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="nopro">{t("nopro")}</option>
          <option value="stolenPic">{t("stolepic")}</option>
          <option value="money">{t("money")}</option>
          <option value="nudity">{t("Nudity")}</option>
          <option value="rude">{t("Rude")}</option>
          <option value="Spam">{t("Spam")}</option>
          <option value="racist">{t("Racist")}</option>
          <option value="other">{t("Other")}</option>
        </select>
      );
    }
    if (this.state.type === flagOptions.Chat) {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="money">{t("money")}</option>
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
          <option value="illegalEvent">{t("illevent")}</option>
          <option value="racist">{t("Racist")}</option>
          <option value="Spam">{t("Spam")}</option>
          <option value="Phishing">{t("Phishing")}</option>
        </select>
      );
    }
  };

  updateBlocked = cache => {
    if (this.state.type === flagOptions.Profile) {
      sessionStorage.getItem("searchProsQuery");
      if (sessionStorage.getItem("searchProsQuery")) {
        const { id } = this.props;
        const variables = JSON.parse(sessionStorage.getItem("searchProsQuery"));
        const { searchProfiles } = cache.readQuery({
          query: SEARCH_PROFILES,
          variables
        });
        searchProfiles.profiles = searchProfiles.profiles.filter(
          el => el.id !== id
        );
        searchProfiles.featuredProfiles = searchProfiles.featuredProfiles.filter(
          el => el.id !== id
        );

        cache.writeQuery({
          query: SEARCH_PROFILES,
          variables,
          data: {
            searchProfiles
          }
        });
      }
    }
  };

  render() {
    const {
      profile,
      close,
      id,
      t,
      ErrorHandler: { ErrorBoundary }
    } = this.props;

    const { other, reason, type } = this.state;
    const blockMenu = this.menu();
    let title;
    if (type === flagOptions.Profile) {
      title =
        t("repblock") +
        " " +
        profile.users.map((user, index) => {
          if (index === 0) return user.username;
          else return +" & " + user.username;
        });
    }
    if (type === flagOptions.Chat) {
      title = t("reportchat");
    } else {
      title = t("repblock");
    }
    return (
      <Modal
        header={title}
        close={close}
        description={t("selreason")}
        okSpan={
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
                  update={this.updateBlocked}
                >
                  {(blockProfile, { loading }) => {
                    if (loading) {
                      return <div>{t("Saving")}</div>;
                    }
                    return (
                      <span
                        onClick={() =>
                          this.handleSubmit(blockProfile, flagItem)
                        }
                        className={"color"}
                        disabled={reason === "" || loading}
                      >
                        {t("repblock")}
                      </span>
                    );
                  }}
                </Mutation>
              );
            }}
          </Mutation>
        }
      >
        <ErrorBoundary>
          <>
            <div className="select-container">
              <label>{t("reasonlbl")}</label>
              {blockMenu}
              <div
                style={{
                  display: other ? "block" : "none"
                }}
              >
                <input
                  placeholder={t("otherreason")}
                  onChange={this.handleTextChange}
                  value={reason}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </>
        </ErrorBoundary>
      </Modal>
    );
  }
}

export default withTranslation("modals")(BlockModal);
