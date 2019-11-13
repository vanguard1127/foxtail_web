import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NoticesMenu from "./NoticesMenu";
import Alert from "./Alert";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  GET_COUNTS
} from "../../queries";
import { Mutation, withApollo } from "react-apollo";

const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
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
      this.props.count !== nextProps.count ||
      this.state.notificationIDs.length !== nextState.notificationIDs.length ||
      this.state.skip !== nextState.skip ||
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

  skipForward = () => {
    if (this.mounted) {
      this.setState({
        skip: this.state.skip + parseInt(process.env.REACT_APP_NOTICELIST_LIMIT)
      });
    }
    return this.state.skip;
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
      variables: {
        limit: parseInt(process.env.REACT_APP_NOTICELIST_LIMIT),
        skip
      }
    });

    if (read) {
      const [id] = notificationIDs;
      var notice = notifications.find(notice => notice.id === id);
      let readNotice = { ...notice };

      if (readNotice) readNotice.read = true;
    } else {
      notificationIDs.forEach(notifID => {
        var notice = notifications.find(notice => notice.id === notifID);
        let seenNotice = { ...notice };
        if (seenNotice) seenNotice.seen = true;
      });

      const { getCounts } = cache.readQuery({
        query: GET_COUNTS
      });

      let newCounts = { ...getCounts };

      newCounts.noticesCount = newCounts.noticesCount - notificationIDs.length;

      cache.writeQuery({
        query: GET_COUNTS,
        data: {
          getCounts: { ...newCounts }
        }
      });
    }

    cache.writeQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: parseInt(process.env.REACT_APP_NOTICELIST_LIMIT) },
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

    const { t, history, ErrorHandler, recount, count } = this.props;
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
                limit={parseInt(process.env.REACT_APP_NOTICELIST_LIMIT)}
                skip={skip}
                recount={recount}
                skipForward={this.skipForward}
              />
            </span>
          );
        }}
      </Mutation>
    );
  }
}

export default withApollo(withRouter(NoticesItem));
