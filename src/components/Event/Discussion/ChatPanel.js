import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { POST_COMMENT } from "../../../queries";

class ChatPanel extends PureComponent {
  state = {
    text: ""
  };

  componentDidMount() {
    this.mounted = true;
    this.textInput.focus();
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  submitMessage(e, postComment) {
    this.props.ErrorHandler.setBreadcrumb("Send comment (event)");
    e.preventDefault();

    postComment()
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
    this.setState({ text: e.target.value });
  };

  render() {
    const { chatID, t } = this.props;
    const { text } = this.state;

    return (
      <Mutation
        mutation={POST_COMMENT}
        variables={{
          chatID,
          text
        }}
      >
        {(postComment, { data, loading, error }) => (
          <div className="send-message">
            <textarea
              value={text}
              onChange={e => this.setText(e)}
              placeholder={t("nowyoucan") + "..."}
              ref={input => {
                this.textInput = input;
              }}
            />
            <button
              onClick={e => this.submitMessage(e, postComment)}
              disabled={text.trim() === ""}
            >
              {t("common:postcomm")}
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
