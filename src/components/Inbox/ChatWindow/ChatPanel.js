import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { SEND_MESSAGE, GET_MESSAGES } from "../../../queries";
class ChatPanel extends PureComponent {
  sending = false;
  state = {
    text: ""
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  submitMessage(e, sendMessage) {
    if (!this.sending) {
      this.sending = true;
      this.props.ErrorHandler.setBreadcrumb("Send message (chat)");
      e.preventDefault();

      sendMessage()
        .then(({ data }) => {
          if (this.mounted) {
            this.setState({ text: "" });
            this.sending = false;
          }
        })
        .catch(res => {
          this.props.ErrorHandler.catchErrors(res.graphQLErrors);
          this.sending = false;
        });
    }
  }

  setText = e => {
    if (this.mounted) {
      this.setState({ text: e.target.value });
    }
  };

  handleReset(resetChat) {
    resetChat()
      .then(({ data }) => {
        if (this.mounted) {
          this.setState({ text: "" });
        }
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  }

  setText = e => {
    if (this.mounted) {
      this.setState({ text: e.target.value });
    }
  };

  updateChat = cache => {
    //TODO: Is this useful to update inbox item?
    // const { chatID, cursor, limit, currentuser } = this.props;
    // const { text } = this.state;
    // let { getMessages } = cache.readQuery({
    //   query: GET_MESSAGES,
    //   variables: { chatID, cursor, limit }
    // });
    // getMessages.messages.unshift({
    //   createdAt: Date.now(),
    //   fromUser: {
    //     username: currentuser.username,
    //     id: currentuser.userID,
    //     profile: { id: currentuser.profileID, __typename: "ProfileType" },
    //     __typename: "UserType"
    //   },
    //   id: Date.now(),
    //   profilePic: currentuser.profilePic,
    //   text,
    //   type: "msg",
    //   __typename: "MessageType"
    // });
    // cache.writeQuery({
    //   query: GET_MESSAGES,
    //   variables: { chatID, cursor, limit },
    //   data: {
    //     getMessages
    //   }
    // });
  };

  render() {
    const { chatID, t } = this.props;
    const { text } = this.state;

    return (
      <Mutation
        mutation={SEND_MESSAGE}
        variables={{
          chatID,
          text
        }}
        // update={this.updateChat}
      >
        {sendMessage => (
          <form onSubmit={e => this.submitMessage(e, sendMessage)}>
            <div className="panel">
              {/* <div className="files" /> */}
              <div className="textarea">
                <input
                  autoFocus
                  placeholder={t("typemsg") + "..."}
                  value={text}
                  onChange={e => this.setText(e)}
                  aria-label="message search"
                />
              </div>
              <div className="send">
                <button type="submit" disabled={!text.trim() || this.sending}>
                  {t("common:Send")}
                </button>
              </div>
            </div>{" "}
          </form>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
