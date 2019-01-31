import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { POST_COMMENT } from '../../queries';

class ChatPanel extends Component {
  state = {
    text: ''
  };

  //TODO: Optimistic UI new message to prevent empty msg problem
  submitMessage(e, postComment) {
    this.props.ErrorHandler.setBreadcrumb('Send comment (event)');
    e.preventDefault();

    postComment()
      .then(({ data }) => {
        this.setState({ text: '' });
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
              placeholder={t('nowyoucan') + '...'}
            />
            <button onClick={e => this.submitMessage(e, postComment)}>
              {t('common:sendmsg')}
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}

export default ChatPanel;
