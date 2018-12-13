import React, { Component } from "react";
import { Dropdown, Menu, Icon, Avatar, Badge } from "antd";
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
class NoticesDropdown extends Component {
  state = { read: false, notificationIDs: [], count: 0 };

  setCount = value => {
    this.setState({ count: value });
  };

  seeNotices = async ({ notfications, updateNotifications }) => {
    try {
      const toBeSeen = await notfications.reduce(function(result, notice) {
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
  render() {
    const { read, notificationIDs, count } = this.state;

    return (
      <Mutation
        mutation={UPDATE_NOTIFICATIONS}
        variables={{
          notificationIDs,
          read
        }}
      >
        {(updateNotifications, { loading }) => {
          return (
            <Query query={GET_NOTIFICATIONS} fetchPolicy="network-only">
              {({ data, loading, error, subscribeToMore }) => {
                if (loading) {
                  return <Spinner message="Loading..." size="large" />;
                } else if (error) {
                  return <div>{error.message}</div>;
                } else if (!data.getNotifications) {
                  return <div>Error occured. Please contact support!</div>;
                } else if (!data.getNotifications.length === 0) {
                  return <div>You are all caught up :)</div>;
                }

                if (!unsubscribe) {
                  unsubscribe = subscribeToMore({
                    document: NEW_NOTICE_SUB,
                    updateQuery: (prev, { subscriptionData }) => {
                      const { newNoticeSubscribe } = subscriptionData.data;
                      slapAudio.play();
                      if (!newNoticeSubscribe) {
                        return prev;
                      }
                      prev.getNotifications = [
                        newNoticeSubscribe,
                        ...prev.getNotifications
                      ];

                      return prev;
                    }
                  });
                }

                const notfications = data.getNotifications;
                const notficationCount =
                  count > 0 ? count : notfications.length;
                return (
                  <Dropdown
                    overlay={
                      <NoticesList
                        notfications={notfications}
                        setCount={this.setCount}
                      />
                    }
                    trigger={["click"]}
                    placement="bottomRight"
                    onClick={() =>
                      this.seeNotices({
                        notfications,
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
