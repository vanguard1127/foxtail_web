import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { SEND_MESSAGE } from "../../queries";

class ChatPanel extends Component {
  state = {
    text: ""
  };
  submitMessage(e, sendMessage) {
    e.preventDefault();

    sendMessage()
      .then(({ data }) => {
        this.setState({ text: "" });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });

        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
  }

  setText = e => {
    this.setState({ text: e.target.value });
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
      >
        {(sendMessage, { data, loading, error }) => (
          <div className="panel">
            <div className="files" />
            <div className="textarea">
              <input
                placeholder={t("typemsg") + "..."}
                value={text}
                onChange={e => this.setText(e)}
              />
            </div>
            <div className="send">
              <button onClick={e => this.submitMessage(e, sendMessage)}>
                {t("common:Send")}
              </button>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
