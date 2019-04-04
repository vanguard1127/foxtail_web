import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { POST_COMMENT, GET_COMMENTS } from "../../queries";

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

  //TODO: Optimistic UI new message to prevent empty msg problem
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

  updateComments = cache => {
    const { chatID, currentuser, limit } = this.props;
    const { text } = this.state;

    let { getComments } = cache.readQuery({
      query: GET_COMMENTS,
      variables: { chatID, cursor: null, limit }
    });
    getComments.messages = [
      {
        createdAt: Date.now(),
        fromUser: {
          username: currentuser.username,
          id: currentuser.userID,
          __typename: "UserType"
        },
        id: Date.now(),
        profilePic: currentuser.profilePic,
        text,
        type: "comment",
        __typename: "MessageType"
      },
      ...getComments.messages
    ];

    cache.writeQuery({
      query: GET_COMMENTS,
      variables: { chatID, cursor: null, limit },
      data: { getComments }
    });
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
        //  update={this.updateComments}
      >
        {(postComment, { data, loading, error }) => (
          <div className="send-message">
            <textarea
              value={text}
              onChange={e => this.setText(e)}
              placeholder={t("nowyoucan") + "..."}
            />
            <button onClick={e => this.submitMessage(e, postComment)}>
              {t("common:sendmsg")}
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
