import React, { Component } from 'react';
import Dropdown from 'rc-dropdown';
import {
  GET_FRIENDS,
  GET_CHAT_PARTICIPANTS,
  GET_EVENT_PARTICIPANTS,
  INVITE_PROFILES_EVENT
} from '../../queries';
import { Query, Mutation } from 'react-apollo';
import Spinner from './Spinner';
import MembersList from './MembersList';
const LIMIT = 5;
class MembersDropdown extends Component {
  state = { visible: false };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };
  render() {
    const {
      targetType,
      targetID,
      listType,
      clickComponent,
      t,
      close,
      isOwner
    } = this.props;
    if (listType === 'friends') {
      return (
        <Query query={GET_FRIENDS} variables={{ limit: LIMIT }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.getFriends) {
              return <div>{t('common:error') + '!'}</div>;
            } else if (!data.getFriends.length === 0) {
              return <div>{t('common:nomoremsgs') + ' :)'}</div>;
            }

            const members = data.getFriends;
            return (
              <div className="event-inv-toggle">
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t('common:invitemems')}</div>
                    {members.length === 0 && <div>No Members Available</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      close={close}
                      showActionButton={true}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === 'participants' &&
      targetType === 'chat' &&
      isOwner
    ) {
      return (
        <Query query={GET_CHAT_PARTICIPANTS} variables={{ chatID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.chat) {
              return <div>{t('common:error') + '!'}</div>;
            } else if (!data.chat.participants.length === 0) {
              return <div>{t('common:nomoremsgs') + ' :)'}</div>;
            }
            const members = data.chat.participants;
            return (
              <div className="event-inv-toggle">
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t('common:removemems')}</div>
                    {members.length === 0 && <div>No Members Available</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      showActionButton={true}
                      close={close}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === 'participants' &&
      targetType === 'chat' &&
      !isOwner
    ) {
      return (
        <Query query={GET_CHAT_PARTICIPANTS} variables={{ chatID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Spinner message={t('common:Loading') + '...'} size="large" />
              );
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.chat) {
              return <div>{t('common:error') + '!'}</div>;
            } else if (!data.chat.participants.length === 0) {
              return <div>{t('common:nomoremsgs') + ' :)'}</div>;
            }
            const members = data.chat.participants;
            return (
              <div className="event-inv-toggle">
                <div className="invite-member">
                  <div className="content">
                    <div className="head">Participants</div>
                    {members.length === 0 && <div>No Members Available</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      showActionButton={false}
                      close={close}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === 'participants' &&
      targetType === 'event' &&
      isOwner
    ) {
      return (
        <Query query={GET_EVENT_PARTICIPANTS} variables={{ eventID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.event) {
              return <div>{t('common:error') + '!'}</div>;
            } else if (!data.event.participants.length === 0) {
              return <div>{t('common:nomorepart')}</div>;
            }
            const members = data.event.participants;
            return (
              <div className="event-inv-toggle">
                <div className="invite-member">
                  <div className="content">
                    <div className="head">{t('common:removemems')}</div>
                    {members.length === 0 && <div>No Members Available</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      close={close}
                      showActionButton={true}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    } else if (
      listType === 'participants' &&
      targetType === 'event' &&
      !isOwner
    ) {
      return (
        <Query query={GET_EVENT_PARTICIPANTS} variables={{ eventID: targetID }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return <Spinner message="Loading..." size="large" />;
            } else if (error) {
              return <div>{error.message}</div>;
            } else if (!data.event) {
              return <div>{t('common:error') + '!'}</div>;
            } else if (!data.event.participants.length === 0) {
              return <div>{t('common:nomorepart')}</div>;
            }
            const members = data.event.participants;
            return (
              <div className="event-inv-toggle">
                <div className="invite-member">
                  <div className="content">
                    <div className="head">Participants</div>
                    {members.length === 0 && <div>No Members Available</div>}
                    <MembersList
                      members={members}
                      fetchMore={fetchMore}
                      targetID={targetID}
                      listType={listType}
                      targetType={targetType}
                      close={close}
                      showActionButton={false}
                      t={t}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      );
    }
  }
}

export default MembersDropdown;
