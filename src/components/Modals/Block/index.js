import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { BLOCK_PROFILE, FLAG_ITEM } from "../../../queries";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import Modal from "../../common/Modal";
import { flagOptions } from "../../../docs/options";

class BlockModal extends Component {
  state = { other: false, reason: "", type: this.props.type };
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
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  handleChange = e => {
    if (this.mounted && e.target.value !== "") {
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
    const { t, close, goToMain, ErrorHandler, ReactGA } = this.props;
    if (this.state.reason === "") {
      if (!toast.isActive("err")) {
        toast.error(t("plsreason"), {
          position: toast.POSITION.TOP_CENTER,
          toastId: "err"
        });
      }
      return;
    }
    flagItem()
      .then(() => {
        if (this.state.type === flagOptions.Profile) {
          blockProfile().then(({ data }) => {
            if (data.blockProfile) {
              ReactGA.event({
                category: "Profile",
                action: "Block"
              });
              toast.success(t("selproreported"));
              goToMain();
            }
          });
        } else if (this.state.type === flagOptions.Chat) {
          ReactGA.event({
            category: "Chat",
            action: "Block"
          });
          toast.success(t("chatreported"));
        } else if (this.state.type === flagOptions.Event) {
          ReactGA.event({
            category: "Event",
            action: "Block"
          });
          toast.success(t("evereported"));
        }
        close();
      })
      .catch(res => {
        ErrorHandler.catchErrors(res);
      });
  };

  menu = () => {
    const { t } = this.props;
    if (this.state.type === flagOptions.Profile) {
      return (
        <select
          defaultValue=""
          style={{ display: "flex", flex: "1", margin: "10px" }}
          onChange={this.handleChange}
        >
          <option value="">{t("plsreason")}</option>
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
          <option value="">{t("plsreason")}</option>
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
          <option value="">{t("plsreason")}</option>
          <option value="illegalEvent">{t("illevent")}</option>
          <option value="racist">{t("Racist")}</option>
          <option value="Spam">{t("Spam")}</option>
          <option value="Phishing">{t("Phishing")}</option>
        </select>
      );
    }
  };

  render() {
    const {
      profile,
      close,
      id,
      t,
      tReady,
      ErrorHandler: { ErrorBoundary }
    } = this.props;

    if (!tReady) {
      return null;
    }

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
        className="report"
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
                >
                  {(blockProfile, { loading }) => {
                    if (loading) {
                      return <div>{t("common:Saving")}</div>;
                    }
                    return (
                      <span
                        onClick={() =>
                          this.handleSubmit(blockProfile, flagItem)
                        }
                        className={"color"}
                        disabled={reason === "" || loading}
                      >
                        {t("report")}
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
            <div className="select-outline">
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
