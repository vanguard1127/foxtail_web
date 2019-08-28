import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NoticesMenu from "./NoticesMenu";
import { NOTICELIST_LIMIT } from "../../docs/consts";
import Alert from "./Alert";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  GET_COUNTS
} from "../../queries";
import { Query, Mutation, withApollo } from "react-apollo";

const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  count: 0,
  skip: 0,
  alertVisible: false,
  alert: null
};

class NoticesItem extends Component {
  state = {
    ...intialState
  };
  updateNotifications = null;

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.read !== nextState.read ||
      this.state.seen !== nextState.seen ||
      this.state.notificationIDs.length !== nextState.notificationIDs.length ||
      this.state.count !== nextState.count ||
      this.state.skip !== nextState.skip ||
      this.props.count !== nextProps.count ||
      this.props.t !== nextProps.t ||
      this.state.alertVisible !== nextState.alertVisible ||
      this.state.alert !== nextState.alert
    ) {
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

  setAlert = ({ alert }) => {
    if (this.mounted) {
      this.setState({ alert, alertVisible: true });
    }
  };

  handleCloseAlert = notificationID => {
    if (this.mounted) {
      this.readNotices([notificationID]);
      this.setState({
        alertVisible: false,
        alert: null
      });
    }
  };

  readNotices = notificationIDs => {
    if (this.mounted) {
      this.setState({ notificationIDs, read: true }, () => {
        this.updateNotifications()
          .then(({ data }) => {
            this.clearState();
          })
          .catch(res => {
            this.props.ErrorHandler.catchErrors(res.graphQLErrors);
          });
      });
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
      if (readNotice) readNotice.read = true;
    } else {
      notificationIDs.forEach(notifID => {
        var seenNotice = notifications.find(notice => notice.id === notifID);
        if (seenNotice) seenNotice.seen = true;
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

  render() {
    const {
      read,
      seen,
      notificationIDs,
      skip,
      alert,
      alertVisible
    } = this.state;
    const { t, count, history, ErrorHandler, recount } = this.props;
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
          if (loading) {
            return (
              <span>
                <div className="notification">
                  <span className="icon alert" />
                </div>
              </span>
            );
          }
          this.updateNotifications = updateNotifications;
          return (
            <span>
              {alertVisible && (
                <Alert
                  alert={alert}
                  close={() => this.handleCloseAlert(alert.id)}
                  t={t}
                  visible={alertVisible}
                />
              )}
              <NoticesMenu
                history={history}
                updateNotifications={updateNotifications}
                ErrorHandler={ErrorHandler}
                count={count}
                t={t}
                setAlert={this.setAlert}
                readNotices={this.readNotices}
                limit={NOTICELIST_LIMIT}
                skip={skip}
                recount={recount}
              />
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(withRouter(NoticesItem));
