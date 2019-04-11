import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withNamespaces } from "react-i18next";
import { SEND_MESSAGE } from "queries";
import Modal from "../../common/Modal";
import { toast } from "react-toastify";

class DirectMsg extends Component {
  state = { text: "", sending: false };
  componentDidMount() {
    this.mounted = true;
    this.textInput.focus();
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.text !== nextState.text) {
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
    this.props.ErrorHandler.setBreadcrumb("send direct message");
    e.preventDefault();
    this.setState({ sending: true }, () => {
      sendMessage()
        .then(async ({ data }) => {
          if (data.sendMessage) {
            toast.success("Message Sent");

            if (this.mounted) {
              if (this.props.setMsgd) {
                this.props.setMsgd(this.props.profile.id);
              }
              this.setState({ text: "" });
            }
            this.props.close();
          } else {
            toast.error("Message not sent.");
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  render() {
    const {
      close,
      profile,
      t,
      ErrorHandler: { ErrorBoundary }
    } = this.props;
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
        description="Say something more than 'Hi'!"
        okSpan={
          text !== "" ? (
            <Mutation
              mutation={SEND_MESSAGE}
              variables={{
                text,
                invitedProfile: profile.id
              }}
            >
              {(sendMessage, { loading, error }) => {
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
              ref={input => {
                this.textInput = input;
              }}
            />
          </div>
        </ErrorBoundary>
      </Modal>
    );
  }
}
export default withNamespaces("modals")(DirectMsg);
