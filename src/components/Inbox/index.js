import React, { Component } from 'react';

import withAuth from '../withAuth';
import { withNamespaces } from 'react-i18next';
import InboxPanel from './InboxPanel';
import Header from './Header';
import ChatInfo from './ChatInfo';
import { GET_COUNTS, READ_CHAT, GET_INBOX } from '../../queries';
import { Mutation } from 'react-apollo';
import ChatWindow from './ChatWindow';
import * as ErrorHandler from '../common/ErrorHandler';

class InboxPage extends Component {
  state = { chatID: null, chat: null, unSeenCount: 0 };

  handleChatClick = (chatID, unSeenCount, readChat) => {
    ErrorHandler.setBreadcrumb('Open Chat:' + chatID);
    this.setState({ chatID, unSeenCount }, () => {
      readChat()
        .then(({ data }) => {
          this.setState({ chat: data.readChat });
        })
        .catch(res => {
          ErrorHandler.catchErrors(res.graphQLErrors);
        });
    });
  };

  updateCount = cache => {
    const { unSeenCount, chatID } = this.state;

    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });
    getCounts.msgsCount = getCounts.msgsCount - unSeenCount;

    cache.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts
      }
    });

    const { getInbox } = cache.readQuery({
      query: GET_INBOX
    });

    const chatIndex = getInbox.findIndex(chat => chat.chatID === chatID);
    if (chatIndex > -1) {
      getInbox[chatIndex].unSeenCount = 0;

      cache.writeQuery({
        query: GET_INBOX,
        data: {
          getInbox
        }
      });
    }
  };

  componentWillUnmount() {
    sessionStorage.setItem('page', null);
    sessionStorage.setItem('pid', null);
  }

  render() {
    sessionStorage.setItem('page', 'inbox');
    const { t } = this.props;
    const { currentuser } = this.props.session;
    let { chatID, chat } = this.state;
    chatID = this.state.chatID;
    if (chatID === null) {
      chatID = this.props.match.params.chatID;
      if (chatID === 'null' || chatID === undefined) {
        chatID = null;
      }
    }
    const inboxPanel = (
      <Mutation
        mutation={READ_CHAT}
        variables={{ chatID }}
        update={this.updateCount}
      >
        {readChat => {
          return (
            <ErrorHandler.ErrorBoundary>
              <InboxPanel
                readChat={(id, unSeenCount) =>
                  this.handleChatClick(id, unSeenCount, readChat)
                }
                currentUserID={currentuser.userID}
                ErrorHandler={ErrorHandler}
                t={t}
              />
            </ErrorHandler.ErrorBoundary>
          );
        }}
      </Mutation>
    );

    return (
      <div>
        <ErrorHandler.ErrorBoundary>
          <Header t={t} />
        </ErrorHandler.ErrorBoundary>
        <section className="inbox">
          <div className="row no-gutters">
            {inboxPanel}
            <ErrorHandler.ErrorBoundary>
              {' '}
              <ChatWindow
                currentChat={chat}
                currentuser={currentuser}
                t={t}
                ErrorHandler={ErrorHandler}
              />
              <ChatInfo t={t} />
            </ErrorHandler.ErrorBoundary>
          </div>
        </section>
      </div>
    );
  }
}

export default withAuth(session => session && session.currentuser)(
  withNamespaces('inbox')(InboxPage)
);
