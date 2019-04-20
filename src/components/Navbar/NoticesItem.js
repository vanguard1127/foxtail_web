import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import NoticesList from "./NoticesList";
import Menu from "../common/Menu";
import { NOTICELIST_LIMIT } from "../../docs/consts";
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
let unsubscribe = null;

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

class NoticesItem extends Component {
  state = {
    ...intialState
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.read !== nextState.read ||
      this.state.seen !== nextState.seen ||
      this.state.notificationIDs.length !== nextState.notificationIDs.length ||
      this.state.count !== nextState.count ||
      this.state.skip !== nextState.skip ||
      this.state.visible !== nextState.visible ||
      this.state.alertVisible !== nextState.alertVisible ||
      this.state.userAlert !== nextState.userAlert ||
      this.props.count !== nextProps.count
    ) {
      // console.log(
      //   "Diffs:",
      //   this.state.read === nextState.read,
      //   this.state.seen === nextState.seen,
      //   this.state.notificationIDs.length === nextState.notificationIDs.length,
      //   this.state.count === nextState.count,
      //   this.state.skip === nextState.skip,
      //   this.state.visible === nextState.visible,
      //   this.state.alertVisible === nextState.alertVisible,
      //   this.state.userAlert === nextState.userAlert,
      //   this.props.count === nextProps.count
      // );
      return true;
    }
    return false;
  }

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
    const { notificationIDs, skip, read } = this.state;
    const {
      getNotifications,
      getNotifications: { notifications }
    } = cache.readQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: NOTICELIST_LIMIT, skip }
    });

    if (read) {
      const [id] = notificationIDs;
      var readNotice = notifications.find(notice => notice.id === id);
      readNotice.read = true;
    } else {
      notificationIDs.forEach(notifID => {
        var seenNotice = notifications.find(notice => notice.id === notifID);
        seenNotice.seen = true;
      });

      const { getCounts } = cache.readQuery({
        query: GET_COUNTS
      });

      getCounts.noticesCount = getCounts.noticesCount - notificationIDs.length;

      cache.writeQuery({
        query: GET_COUNTS,
        data: {
          getCounts
        }
      });
    }

    cache.writeQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: NOTICELIST_LIMIT },
      data: {
        getNotifications: { ...getNotifications, notifications }
      }
    });
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

  seeNotices = (notifications, updateNotifications) => {
    if (this.mounted) {
      const unseenIDs = notifications.reduce((res, el) => {
        if (!el.seen) {
          res.push(el.id);
        }
        return res;
      }, []);

      this.setState({ notificationIDs: unseenIDs, seen: true }, () => {
        updateNotifications()
          .then(({ data }) => {
            this.props.countRefetch();
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
              console.log("DATA", data);
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
              variables={{ limit: NOTICELIST_LIMIT, skip }}
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
                if (
                  loading ||
                  !data.getNotifications ||
                  !data.getNotifications.notifications
                ) {
                  return (
                    <span>
                      <div className="notification">
                        <span className="icon alert" />
                      </div>{" "}
                    </span>
                  );
                } else if (error) {
                  return <div>{error.message}</div>;
                } else if (!data.getNotifications.notifications.length === 0) {
                  return <div>{t("nonots")} :)</div>;
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

                const { notifications, alert } = data.getNotifications;
                //TODO: TICKET: 290 find why this is rerendering so much
                //console.log("WHY AM I HAPPENING MULTIPLE TIMES");
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
                      closeAction={() =>
                        this.seeNotices(notifications, updateNotifications)
                      }
                    >
                      <NoticesList
                        notifications={notifications}
                        history={history}
                        fetchMore={fetchMore}
                        close={() =>
                          this.seeNotices(notifications, updateNotifications)
                        }
                        t={t}
                        visible={this.state.visible}
                        readNotices={e =>
                          this.readNotices(e, updateNotifications)
                        }
                        showAlert={this.showAlert}
                        ErrorHandler={ErrorHandler}
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
