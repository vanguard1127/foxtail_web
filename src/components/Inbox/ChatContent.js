import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { GET_MESSAGES, NEW_MESSAGE_SUB } from '../../queries';
import Waypoint from 'react-waypoint';
import Spinner from '../common/Spinner';
import MessageList from './MessageList';

class ChatContent extends Component {
  handleEnd = (previousPosition, currentPosition, fetchMore, cursor) => {
    if (
      this.messagesRef &&
      this.messagesRef.current.scrollTop < 100 &&
      this.props.hasMoreItems &&
      this.props.loading !== true
    ) {
      if (
        (!previousPosition && currentPosition === Waypoint.inside) ||
        previousPosition === Waypoint.above
      ) {
        const { chatID, limit } = this.props;
        this.props.setValue({
          name: 'loading',
          value: true
        });
        fetchMore({
          variables: {
            chatID,
            limit,
            cursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            if (fetchMoreResult.getMessages.messages < limit) {
              this.props.setValue({
                name: 'hasMoreItems',
                value: false
              });
            }
            console.log('NEW', ...fetchMoreResult.getMessages.messages);
            console.log('OLD', ...previousResult.getMessages.messages);
            previousResult.getMessages.messages = [
              ...previousResult.getMessages.messages,
              ...fetchMoreResult.getMessages.messages
            ];

            return previousResult;
          }
        });
        this.props.setValue({
          name: 'loading',
          value: false
        });
      }
    }
  };

  fetchData = async (fetchMore, cursor) => {
    this.props.ErrorHandler.setBreadcrumb('fetch more messages');
    const { chatID, limit } = this.props;
    this.props.setValue({
      name: 'loading',
      value: true
    });
    fetchMore({
      variables: {
        chatID,
        limit,
        cursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        if (fetchMoreResult.getMessages.messages < limit) {
          this.props.setValue({
            name: 'hasMoreItems',
            value: false
          });
        }

        previousResult.getMessages.messages = [
          ...previousResult.getMessages.messages,
          ...fetchMoreResult.getMessages.messages
        ];

        return previousResult;
      }
    });
    this.props.setValue({
      name: 'loading',
      value: false
    });
  };
  //TODO: use global spinner and error instead of chnaging each
  render() {
    const { chatID, currentUserID, t, ErrorHandler } = this.props;

    const { cursor, limit } = this.props;
    return (
      <div
        className="content"
        style={{ display: 'flex', flexDirection: ' column-reverse' }}
      >
        {' '}
        <Query
          query={GET_MESSAGES}
          variables={{ chatID, limit, cursor }}
          fetchPolicy="cache-first"
        >
          {({ data, loading, error, subscribeToMore, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            }
            if (error) {
              return (
                <ErrorHandler.report error={error} calledName={'getSettings'} />
              );
            }

            return (
              <MessageList
                chatID={chatID}
                currentUserID={currentUserID}
                ref={this.MessageList}
                t={t}
                messages={
                  data && data.getMessages ? data.getMessages.messages : []
                }
                subscribe={() =>
                  subscribeToMore({
                    document: NEW_MESSAGE_SUB,
                    variables: {
                      chatID: chatID
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                      const { newMessageSubscribe } = subscriptionData.data;
                      if (!newMessageSubscribe) {
                        return prev;
                      }
                      if (prev.getMessages) {
                        prev.getMessages.messages = [
                          newMessageSubscribe,
                          ...prev.getMessages.messages
                        ];
                      } else {
                        prev.getMessages = {
                          messages: [newMessageSubscribe],
                          __typename: 'ChatType'
                        };
                      }
                      return prev;
                    }
                  })
                }
                handleEnd={this.handleEnd}
                fetchMore={fetchMore}
                limit={limit}
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

export default ChatContent;
