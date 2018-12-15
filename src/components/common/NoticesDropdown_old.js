import React, { Component } from "react";
import { Dropdown, Menu, Icon, Avatar, Badge } from "antd";
import {
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATIONS,
  NEW_NOTICE_SUB
} from "../../queries";
import { Query, Mutation } from "react-apollo";
import Spinner from "./Spinner";

let unsubscribe = null;
class NoticesDropdown extends Component {
  state = { read: false, notificationIDs: [], playing: false };

  seeNotices = async ({ notfications, updateNotifications, isReading }) => {
    this.setState({ playing: true });
    var audio = new Audio(require("../../docs/slap.wav"));
    audio.play();
    try {
      if (!isReading) {
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
      } else {
        if (notfications.length !== 0) {
          this.setState({ read: true, notificationIDs: notfications }, () => {
            updateNotifications().catch(res => {
              const errors = res.graphQLErrors.map(error => {
                return error.message;
              });
              //TODO: send errors to analytics from here
              this.setState({ errors });
            });
          });
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  render() {
    const { read, notificationIDs, playing } = this.state;

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
                      console.log("SUBSCRIBE EXECUTED", subscriptionData);
                      console.log("PREV", prev);
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
                console.log("NOTIF", notfications);
                const notficationsList = (
                  <Menu>
                    {data.getNotifications.map(notif => (
                      <Menu.Item key={notif.id}>
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: notif.read ? "#eee" : "#f8e",
                            width: "35vw"
                          }}
                        >
                          {" "}
                          <div>
                            {" "}
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />{" "}
                          </div>
                          <div>
                            <div>{notif.text}</div>

                            <div>
                              <small>{notif.date}</small>
                            </div>
                          </div>
                          <div style={{ display: "flex", float: "right" }}>
                            <a
                              href={null}
                              onClick={() =>
                                this.seeNotices({
                                  notfications: [notif.id],
                                  updateNotifications,
                                  isReading: true
                                })
                              }
                            >
                              read
                            </a>
                          </div>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu>
                );
                return (
                  <Dropdown
                    overlay={notficationsList}
                    trigger={["click"]}
                    placement="bottomRight"
                    onClick={() =>
                      this.seeNotices({
                        notfications,
                        updateNotifications,
                        isReading: false
                      })
                    }
                  >
                    <a className="ant-dropdown-link" href="#">
                      <Badge
                        count={
                          notfications.filter(notice => notice.seen === false)
                            .length
                        }
                      >
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
