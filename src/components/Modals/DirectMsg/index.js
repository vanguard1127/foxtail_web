import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SEND_MESSAGE } from "../../../queries";
import Modal from "../../common/Modal";
import deleteFromCache from "../../../utils/deleteFromCache";

class DirectMsg extends Component {
  state = { text: "", sending: false };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  clearInboxResults = () => {
    const { cache } = this.props.client;
    deleteFromCache({ cache, query: "getInbox" });
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.text !== nextState.text ||
      this.props.t !== nextProps.t ||
      this.props.tReady !== nextProps.tReady
    ) {
      return true;
    }
    return false;
  }

  handleTextChange = event => {
    if (this.mounted) {
      this.setState({ text: event.target.value });
    }
  };

  handleSubmit = (e, sendMessage) => {
    e.preventDefault();
    const { t, close, setMsgd, ReactGA, ErrorHandler, profile } = this.props;
    ErrorHandler.setBreadcrumb("send direct message");
    this.setState({ sending: true }, () => {
      sendMessage()
        .then(async ({ data }) => {
          if (data.sendMessage) {
            this.setState({ text: "" });
            this.clearInboxResults();
            toast.success(t("common:msgsent"));
            ReactGA.event({
              category: "Profile",
              action: "Send Direct Msg"
            });
            if (setMsgd) {
              setMsgd(profile.id);
            } else {
              close();
            }
          } else {
            toast.error(t("msgnotsent"));
            close();
          }
        })
        .catch(res => {
          ErrorHandler.catchErrors(res);
          close();
        });
    });
  };

  render() {
    const {
      close,
      profile,
      t,
      ErrorHandler: { ErrorBoundary },
      tReady
    } = this.props;

    if (!tReady) {
      return null;
    }
    const { text, sending } = this.state;
    return (
      <Modal
        header={
          profile
            ? t("common:sendamsg") +
              " " +
              profile.users.map((user, index) => {
                if (index === 0) return user.username;
                else return +" & " + user.username;
              }) +
              "?"
            : t("common:sendamsg")
        }
        close={close}
        description={t("sayhi")}
        okSpan={
          text !== "" ? (
            <Mutation
              mutation={SEND_MESSAGE}
              variables={{
                text,
                invitedProfile: profile.id,
                instant: true
              }}
            >
              {sendMessage => {
                return (
                  <button
                    className="color"
                    type="submit"
                    onClick={e => this.handleSubmit(e, sendMessage)}
                    disabled={sending}
                  >
                    {t("common:Send")}
                  </button>
                );
              }}
            </Mutation>
          ) : null
        }
      >
        {" "}
        <ErrorBoundary>
          <div className="input">
            <input
              placeholder={t("writemsg") + "..."}
              value={text}
              onChange={this.handleTextChange}
              autoFocus
            />
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withApollo(withTranslation("modals")(DirectMsg));
