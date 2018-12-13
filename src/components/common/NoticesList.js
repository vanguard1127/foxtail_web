import React, { Component } from "react";
import { Menu, Avatar } from "antd";
import { UPDATE_NOTIFICATIONS, NEW_NOTICE_SUB } from "../../queries";
import { Mutation } from "react-apollo";

class NoticesDropdown extends Component {
  state = {
    read: false,
    notificationIDs: []
  };

  // componentDidMount() {
  //   this.props.subscribeToMore({
  //     document: NEW_NOTICE_SUB,
  //     updateQuery: (prev, { subscriptionData }) => {
  //       const { newNoticeSubscribe } = subscriptionData.data;
  //       const { notfications } = this.state;
  //       console.log("SUBSCRIBE EXECUTED", newNoticeSubscribe);
  //       console.log("PREV", prev);
  //       slapAudio.play();
  //       if (!newNoticeSubscribe) {
  //         return;
  //       }
  //       const newNotificationsList = [...notfications, newNoticeSubscribe];
  //       this.props.setCount(newNotificationsList.length);
  //       this.setState({ notfications: newNotificationsList });
  //       return;
  //     }
  //   });
  // }

  seeNotices = async ({ notfications, updateNotifications }) => {
    try {
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
    } catch (e) {
      console.error(e.message);
    }
  };

  render() {
    const { updateNotifications, notfications } = this.props;
    return (
      <Menu>
        {notfications.map(notif => (
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
                      updateNotifications
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
  }
}

export default NoticesDropdown;
