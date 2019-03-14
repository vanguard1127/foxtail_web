import React, { PureComponent } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import NoticesList from './NoticesList';
import Menu from '../common/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB,
  GET_COUNTS
} from '../../queries';
import { Query, Mutation, withApollo } from 'react-apollo';

const LIMIT = 5;
const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  count: 0,
  skip: 0,
  visible: false,
  alertVisible: true,
  userAlert: null
};

class NoticesItem extends PureComponent {
  state = {
    ...intialState
  };

  clearState = () => {
    this.setState({ ...intialState });
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  updateRead = cache => {
    // const { notificationIDs } = this.state;
    // const {
    //   getNotifications,
    //   getNotifications: { notifications }
    // } = cache.readQuery({
    //   query: GET_NOTIFICATIONS,
    //   variables: { limit: LIMIT }
    // });
    // const [id] = notificationIDs;
    // var index = notifications.findIndex(notice => notice.id === id);
    // const readNotice = notifications[index];
    // // Replace item at index using native splice
    // notifications.splice(index, 1, { ...readNotice, read: true });
    // cache.writeQuery({
    //   query: GET_NOTIFICATIONS,
    //   variables: { limit: LIMIT },
    //   data: {
    //     getNotifications: { ...getNotifications, notifications }
    //   }
    // });
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

  handleCloseAlert = (notificationID, updateNotifications, refetch) => {
    this.setState(
      {
        notificationIDs: [notificationID],
        read: true,
        alertVisible: false,
        userAlert: null
      },
      () => {
        updateNotifications()
          .then(({ data }) => {
            refetch();
          })
          .catch(res => {
            const errors = res.graphQLErrors.map(error => {
              return error.message;
            });
            //TODO: send errors to analytics from here
            this.setState({ errors });
          });
      }
    );
  };

  showAlert = alert => {
    this.setState({ userAlert: alert, alertVisible: true });
  };

  handleDialog = ({ alert, updateNotifications, refetch, alertVisible }) => {
    return (
      <Dialog
        onClose={() =>
          this.handleCloseAlert(alert.id, updateNotifications, refetch)
        }
        aria-labelledby="Image"
        open={alertVisible}
      >
        {alert.text && (
          <DialogTitle id="alert-dialog-title">{alert.text}</DialogTitle>
        )}
        {alert.body && (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alert.body}
            </DialogContentText>
          </DialogContent>
        )}
        {alert.link && (
          <DialogActions>
            <NavLink to={alert.link} color="primary" autoFocus>
              Go
            </NavLink>
          </DialogActions>
        )}
      </Dialog>
    );
  };
  render() {
    const {
      read,
      seen,
      notificationIDs,
      skip,
      alertVisible,
      userAlert
    } = this.state;
    const { t, count, history } = this.props;
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
              {({
                data,
                loading,
                error,
                subscribeToMore,
                fetchMore,
                refetch
              }) => {
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

                const { notifications, alert } = data.getNotifications;

                return (
                  <span>
                    <Menu
                      activeStyle="notification active"
                      notActiveStyle={
                        count > 0 ? 'notification active' : 'notification'
                      }
                      menuOpener={
                        <span className="icon alert">
                          {count > 0 && <span className="count">{count}</span>}
                        </span>
                      }
                    >
                      <NoticesList
                        notifications={notifications}
                        history={history}
                        fetchMore={fetchMore}
                        close={() => this.handleVisibleChange(false)}
                        t={t}
                        visible={this.state.visible}
                        updateNotifications={updateNotifications}
                        showAlert={this.showAlert}
                        subscribeToNewNotices={() =>
                          subscribeToMore({
                            document: NEW_NOTICE_SUB,
                            updateQuery: (prev, { subscriptionData }) => {
                              const {
                                newNoticeSubscribe
                              } = subscriptionData.data;

                              if (!newNoticeSubscribe) {
                                return prev;
                              }
                              prev.getNotifications.notifications = [
                                newNoticeSubscribe,
                                ...prev.getNotifications.notifications
                              ];

                              return prev;
                            }
                          })
                        }
                      />
                    </Menu>
                    {alert &&
                      this.handleDialog({
                        alert,
                        updateNotifications,
                        refetch,
                        alertVisible
                      })}{' '}
                    {userAlert &&
                      this.handleDialog({
                        alert: userAlert,
                        updateNotifications,
                        refetch,
                        alertVisible
                      })}
                  </span>
                );
              }}
            </Query>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(withRouter(NoticesItem));
