import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB,
  GET_COUNTS
} from '../../queries';
import { Query, Mutation, withApollo } from 'react-apollo';
import Waypoint from 'react-waypoint';
import moment from 'moment';

let unsubscribe = null;
const LIMIT = 5;
const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  count: 0,
  skip: 0,
  visible: false
};
class NoticesList extends Component {
  state = {
    ...intialState
  };

  clearState = () => {
    this.setState({ ...intialState });
  };

  readNotices = (notificationIDs, updateNotifications) => {
    this.setState({ notificationIDs, read: true }, () => {
      updateNotifications()
        .then(({ data }) => {
          this.clearState();
        })
        .catch(res => {
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });
          //TODO: send errors to analytics from here
          this.setState({ errors });
        });
    });
  };

  updateRead = (cache, data) => {
    const { notificationIDs } = this.state;

    const {
      getNotifications,
      getNotifications: { notifications }
    } = cache.readQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: LIMIT }
    });

    const [id] = notificationIDs;
    var index = notifications.findIndex(notice => notice.id === id);
    const readNotice = notifications[index];
    // Replace item at index using native splice
    notifications.splice(index, 1, { ...readNotice, read: true });

    cache.writeQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: LIMIT },
      data: {
        getNotifications: { ...getNotifications, notifications }
      }
    });
  };

  //TODO: Ensure this causes instant update to nums
  updateSeen = numSeen => {
    const { client } = this.props;
    const { getCounts } = client.readQuery({
      query: GET_COUNTS
    });
    getCounts.noticesCount = getCounts.noticesCount - numSeen;

    client.writeQuery({
      query: GET_COUNTS,
      data: {
        getCounts
      }
    });
  };

  readAndGo = ({ notifications, targetID, type, updateNotifications }) => {
    try {
      const { close } = this.props;
      if (notifications.length !== 0) {
        this.readNotices(notifications, updateNotifications);

        switch (type) {
          case 'chat':
            this.props.history.push('/inbox/' + targetID);
            break;
          case 'event':
            this.props.history.push('/event/' + targetID);
            break;
          default:
            break;
        }
        close();
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  componentWillUnmount() {
    unsubscribe();
  }
  preventContextMenu = e => {
    e.preventDefault();
    alert(
      'Right-click disabled: Saving images on Foxtail will result in your account being banned.'
    );
  };
  render() {
    const { read, seen, notificationIDs, skip } = this.state;
    const { t } = this.props;
    return (
      <Mutation
        mutation={UPDATE_NOTIFICATIONS}
        variables={{
          notificationIDs,
          read,
          seen
        }}
        update={this.updateRead}
      >
        {(updateNotifications, { loading }) => {
          return (
            <Query
              query={GET_NOTIFICATIONS}
              variables={{ limit: LIMIT, skip }}
              fetchPolicy="network-only"
            >
              {({ data, loading, error, subscribeToMore, fetchMore }) => {
                if (loading) {
                  return null;
                } else if (error) {
                  return <div>{error.message}</div>;
                } else if (
                  !data.getNotifications ||
                  !data.getNotifications.notifications
                ) {
                  return <div>{t('common:error')}!</div>;
                } else if (!data.getNotifications.notifications.length === 0) {
                  return <div>{t('nonots')} :)</div>;
                }

                if (!unsubscribe) {
                  unsubscribe = subscribeToMore({
                    document: NEW_NOTICE_SUB,
                    updateQuery: (prev, { subscriptionData }) => {
                      const { newNoticeSubscribe } = subscriptionData.data;

                      if (!newNoticeSubscribe) {
                        return prev;
                      }
                      prev.getNotifications.notifications = [
                        newNoticeSubscribe,
                        ...prev.getNotifications.notifications
                      ];

                      return prev;
                    }
                  });
                }
                const notifications = data.getNotifications.notifications;
                return (
                  <div className="toggle">
                    <div className="notification open">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div className="item" key={notif.id}>
                            <span
                              onClick={() =>
                                this.readAndGo({
                                  notifications: [notif.id],
                                  targetID: notif.targetID,
                                  type: notif.type,
                                  updateNotifications
                                })
                              }
                            >
                              <span className="avatar">
                                <img
                                  src={notif.fromProfile.profilePic}
                                  alt=""
                                  onContextMenu={this.preventContextMenu}
                                />
                              </span>
                              <div>
                                <span className="text">
                                  <b> {notif.fromProfile.profileName} </b>
                                  {t(notif.text)}
                                </span>
                                <span className="when">
                                  {moment(notif.date).fromNow()}
                                </span>
                              </div>
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="item" key="na">
                          <span className="text">No notifcations</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </Query>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(withRouter(NoticesList));
