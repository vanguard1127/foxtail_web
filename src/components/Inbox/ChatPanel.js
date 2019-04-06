import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import {
  SEND_MESSAGE,
  GET_MESSAGES,
  GET_INBOX,
  RESET_CHAT
} from "../../queries";

class ChatPanel extends PureComponent {
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
    this.props.ErrorHandler.setBreadcrumb("Send message (chat)");
    e.preventDefault();

    sendMessage()
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
    const { chatID, cursor, limit, currentuser } = this.props;
    const { text } = this.state;

    let { getMessages } = cache.readQuery({
      query: GET_MESSAGES,
      variables: { chatID, cursor, limit }
    });
    console.log(getMessages, currentuser.profileID);
    getMessages.messages = [
      ...getMessages.messages,
      {
        createdAt: Date.now(),
        fromUser: {
          username: currentuser.username,
          id: currentuser.userID,
          profile: { id: currentuser.profileID, __typename: "ProfileType" },
          __typename: "UserType"
        },
        text,
        type: "msg",
        __typename: "MessageType"
      }
    ];
    console.log("SAVING THS", [
      ...getMessages.messages,
      {
        createdAt: Date.now(),
        fromUser: {
          username: currentuser.username,
          id: currentuser.userID,
          profile: { id: currentuser.profileID, __typename: "ProfileType" },
          __typename: "UserType"
        },
        text,
        type: "msg",
        __typename: "MessageType"
      }
    ]);
    cache.writeQuery({
      query: GET_MESSAGES,
      variables: { chatID, cursor, limit },
      data: {
        ...getMessages
      }
    });

    let { getInbox } = cache.readQuery({
      query: GET_INBOX
    });

    getInbox[getInbox.findIndex(el => el.chatID === chatID)].text = text;
    getInbox[
      getInbox.findIndex(el => el.chatID === chatID)
    ].createdAt = Date.now();

    cache.writeQuery({
      query: GET_INBOX,
      data: {
        ...getInbox
      }
    });
  };

  render() {
    const { chatID, t } = this.props;
    const { text } = this.state;

    return (
      <Mutation
        mutation={RESET_CHAT}
        variables={{
          chatID
        }}
      >
        {resetChat => (
          <Mutation
            mutation={SEND_MESSAGE}
            variables={{
              chatID,
              text
            }}
            update={this.updateChat}
          >
            {sendMessage => (
              <form onSubmit={e => this.submitMessage(e, sendMessage)}>
                <div className="panel">
                  <div
                    className="files"
                    onClick={() => this.handleReset(resetChat)}
                  />
                  <div className="textarea">
                    <input
                      placeholder={t("typemsg") + "..."}
                      value={text}
                      onChange={e => this.setText(e)}
                      aria-label="message search"
                    />
                  </div>
                  <div className="send">
                    <button type="submit" disabled={!text.trim()}>
                      {t("common:Send")}
                    </button>
                  </div>
                </div>{" "}
              </form>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
