import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NoticesMenu from "./NoticesMenu";
import { NOTICELIST_LIMIT } from "../../docs/consts";
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
  visible: false
};

class NoticesItem extends Component {
  state = {
    ...intialState
  };

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    if (
      this.state.read !== nextState.read ||
      this.state.seen !== nextState.seen ||
      this.state.notificationIDs.length !== nextState.notificationIDs.length ||
      this.state.count !== nextState.count ||
      this.state.skip !== nextState.skip ||
      this.state.visible !== nextState.visible ||
      this.props.count !== nextProps.count ||
      this.props.t !== nextProps.t
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
    const { read, seen, notificationIDs, skip } = this.state;
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
          if (loading) {
            return null;
          }
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
                  !data ||
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
                  return (
                    <ErrorHandler.report
                      error={error}
                      calledName={"getNotifications"}
                    />
                  );
                } else if (!data.getNotifications.notifications.length === 0) {
                  return <div>{t("nonots")} :)</div>;
                }

                return (
                  <span>
                    <NoticesMenu
                      visible={this.state.visible}
                      datanotifications={data.getNotifications}
                      history={history}
                      fetchMore={fetchMore}
                      subscribeToMore={subscribeToMore}
                      updateNotifications={updateNotifications}
                      ErrorHandler={ErrorHandler}
                      count={count}
                      t={t}
                    />
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
