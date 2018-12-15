import React, { Component } from "react";
import { Dropdown, Menu, Icon, Avatar, Badge } from "antd";
import _ from "lodash";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB
} from "../../queries";
import { Query, Mutation } from "react-apollo";
import Spinner from "./Spinner";
import NoticesList from "./NoticesList";
var slapAudio = new Audio(require("../../docs/slap.wav"));

let unsubscribe = null;
const LIMIT = 5;
class NoticesDropdown extends Component {
  state = { read: false, notificationIDs: [], count: 0, skip: 0 };

  setCount = value => {
    this.setState({ count: value });
  };

  setSkip = value => {
    this.setState({ skip: value });
  };

  readNotices = (notificationIDs, updateNotifications) => {
    this.setState({ notificationIDs, read: true }, () => {
      updateNotifications().catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        //TODO: send errors to analytics from here
        this.setState({ errors });
      });
    });
  };

  seeNotices = async ({ notifications, updateNotifications }) => {
    try {
      const toBeSeen = await notifications.reduce(function(result, notice) {
        if (!notice.seen) {
          result.push(notice.id);
        }
        return result;
      }, []);

      if (toBeSeen.length !== 0) {
        this.setState({ read: false, notificationIDs: toBeSeen }, () => {
          updateNotifications().catch(res => {
            const errors = res.graphQLErrors.map(error => {
              return error.message;
            });
            //TODO: send errors to analytics from here
            this.setState({ errors });
          });
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  updateSeen = (cache, data) => {
    const { notificationIDs, read } = this.state;

    const {
      getNotifications: { notifications }
    } = cache.readQuery({
      query: GET_NOTIFICATIONS,
      variables: { limit: LIMIT }
    });
    if (!read) {
      const toBeSeen = notifications.reduce(function(result, notice) {
        if (!notice.seen) {
          result.push(notice.id);
        }
        return result;
      }, []);

      cache.writeQuery({
        query: GET_NOTIFICATIONS,
        variables: { limit: LIMIT },
        data: {
          getNotifications: {
            unseen: toBeSeen.length - notificationIDs.length
          }
        }
      });
    } else {
      //TODO: Figure out how to update read without erros
      // var index = _.findIndex(notifications, { id: notificationIDs[0].id });
      // const readNotice = notifications[index];
      // // Replace item at index using native splice
      // notifications.splice(index, 1, { ...readNotice, read: true });
      // cache.writeQuery({
      //   query: GET_NOTIFICATIONS,
      //   variables: { limit: LIMIT },
      //   data: {
      //     getNotifications: { notifications }
      //   }
      // });
    }
  };

  render() {
    const { read, notificationIDs, count } = this.state;

    return (
      <Mutation
        mutation={UPDATE_NOTIFICATIONS}
        variables={{
          notificationIDs,
          read
        }}
        update={this.updateSeen}
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
                  return <Spinner message="Loading..." size="large" />;
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
                      slapAudio.play();
                      prev.getNotifications.notifications = [
                        newNoticeSubscribe,
                        ...prev.getNotifications.notifications
                      ];

                      return prev;
                    }
                  });
                }

                const notifications = data.getNotifications.notifications;
                const notficationCount =
                  count > 0 ? count : data.getNotifications.unseen;
                return (
                  <Dropdown
                    overlay={
                      <NoticesList
                        notifications={notifications}
                        setCount={this.setCount}
                        setSkip={this.setSkip}
                        fetchMore={fetchMore}
                        total={data.getNotifications.total}
                        readNotices={ids =>
                          this.readNotices(ids, updateNotifications)
                        }
                      />
                    }
                    trigger={["click"]}
                    placement="bottomRight"
                    onClick={() =>
                      this.seeNotices({
                        notifications,
                        updateNotifications
                      })
                    }
                  >
                    <a className="ant-dropdown-link" href="#">
                      <Badge count={notficationCount}>
                        {" "}
                        <Icon
                          type="bell"
                          style={{ fontSize: "24px", color: "#eee" }}
                        />
                      </Badge>
                    </a>
                  </Dropdown>
                );
              }}
            </Query>
          );
        }}
      </Mutation>
    );
  }
}

export default NoticesDropdown;
