import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB,
  GET_COUNTS
} from "../../queries";
import { Query, Mutation, withApollo } from "react-apollo";
import Waypoint from "react-waypoint";
import moment from "moment";

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

  readAndGo = async ({
    notifications,
    targetID,
    type,
    updateNotifications
  }) => {
    try {
      const { close } = this.props;
      if (notifications.length !== 0) {
        await this.readNotices(notifications, updateNotifications);

        switch (type) {
          case "chat":
            await this.props.history.push("/inbox/" + targetID);
            break;
          case "event":
            await this.props.history.push("/events/" + targetID);
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

  render() {
    const { read, seen, notificationIDs } = this.state;
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
              variables={{ limit: LIMIT }}
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
                  return <div>Error occured. Please contact support!</div>;
                } else if (!data.getNotifications.notifications.length === 0) {
                  return <div>You are all caught up :)</div>;
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
                      {notifications.map(notif => (
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
                                src="/assets/img/usr/avatar/1001@2x.png"
                                alt=""
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
                      ))}
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
