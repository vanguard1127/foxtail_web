import React, { PureComponent } from "react";
import { withRouter, NavLink } from "react-router-dom";
import NoticesList from "./NoticesList";
import Menu from "../common/Menu";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB,
  GET_COUNTS
} from "../../queries";
import { Query, Mutation, withApollo } from "react-apollo";

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

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  clearState = () => {
    if (this.mounted) {
      this.setState({ ...intialState });
    }
  };

  handleVisibleChange = flag => {
    if (this.mounted) {
      this.setState({ visible: flag });
    }
  };

  updateRead = cache => {
    const { notificationIDs, skip } = this.state;
    const {
      getNotifications,
      getNotifications: { notifications }
    } = cache.readQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: LIMIT, skip }
    });

    const [id] = notificationIDs;
    var readNotice = notifications.find(notice => notice.id === id);
    readNotice.read = true;

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
    this.handleVisibleChange(false);
  };

  readNotices = (notificationIDs, updateNotifications) => {
    if (this.mounted) {
      this.setState({ notificationIDs, read: true }, () => {
        updateNotifications()
          .then(({ data }) => {
            this.clearState();
          })
          .catch(res => {
            this.props.ErrorHandler.catchErrors(res.graphQLErrors);
          });
      });
    }
  };

  handleCloseAlert = (notificationID, updateNotifications, refetch) => {
    if (this.mounted) {
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
              this.props.ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  showAlert = alert => {
    if (this.mounted) {
      this.setState({ userAlert: alert, alertVisible: true });
      //handleCloseAlert = (alert.id, updateNotifications, refetch)
    }
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
    const { t, count, history, ErrorHandler } = this.props;
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
                  return <div>{t("common:error")}!</div>;
                } else if (!data.getNotifications.notifications.length === 0) {
                  return <div>{t("nonots")} :)</div>;
                }

                const { notifications, alert } = data.getNotifications;

                const unseen = notifications.reduce((res, el) => {
                  if (!el.seen) {
                    res++;
                  }
                  return res;
                }, 0);

                return (
                  <span>
                    <Menu
                      activeStyle="notification active"
                      notActiveStyle={
                        count > 0 ? "notification active" : "notification"
                      }
                      menuOpener={
                        <span className="icon alert">
                          {count > 0 && <span className="count">{count}</span>}
                        </span>
                      }
                      closeAction={() => this.updateSeen(unseen)}
                    >
                      <NoticesList
                        notifications={notifications}
                        history={history}
                        fetchMore={fetchMore}
                        close={() => this.updateSeen(unseen)}
                        t={t}
                        visible={this.state.visible}
                        readNotices={e =>
                          this.readNotices(e, updateNotifications)
                        }
                        showAlert={this.showAlert}
                        ErrorHandler={ErrorHandler}
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
                      })}{" "}
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
