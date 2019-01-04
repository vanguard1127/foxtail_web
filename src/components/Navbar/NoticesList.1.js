import React, { Component } from "react";
import { Menu, Avatar, Button } from "antd";
import { withRouter } from "react-router-dom";
import Waypoint from "react-waypoint";

const LIMIT = 5;
class NoticesList extends Component {
  state = {
    skip: 0
  };

  readAndGo = async ({ notifications, targetID, type }) => {
    try {
      const { readNotices, close } = this.props;
      if (notifications.length !== 0) {
        await readNotices(notifications);

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

  handleEnd = previousPosition => {
    //if totoal reach skip and show no more sign
    const { total, setSkip } = this.props;
    const { skip } = this.state;
    if (total > skip * LIMIT) {
      if (previousPosition === Waypoint.below) {
        const { fetchMore } = this.props;
        setSkip(skip + LIMIT);
        this.setState(
          state => ({ skip: skip + LIMIT }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  fetchData = fetchMore => {
    this.setState({ loading: true });

    fetchMore({
      variables: {
        skip: this.state.skip,
        limit: LIMIT
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getNotifications.notifications.length === 0
        ) {
          return previousResult;
        }
        previousResult.getNotifications.notifications = [
          ...fetchMoreResult.getNotifications.notifications,
          ...previousResult.getNotifications.notifications
        ];

        return previousResult;
      }
    });
  };

  handleNoticeMenu = ({ notifications }) => (
    <Menu>
      <Menu.Divider />
      {notifications.map(notif => (
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
                  this.readAndGo({
                    notifications: [notif.id],
                    targetID: notif.targetID,
                    type: notif.type
                  })
                }
              >
                read
              </a>
            </div>
          </div>
        </Menu.Item>
      ))}
      <Waypoint
        onEnter={({ previousPosition }) => this.handleEnd(previousPosition)}
      />
      <Menu.Item disabled>No more notifications :)</Menu.Item>
    </Menu>
  );

  render() {
    const { notifications } = this.props;
    return (
      <div class="toggle">
        <div class="notification open">
          {notifications.map(notif => (
            <div class="item" key={notif.id}>
              <a href="#">
                <span class="avatar">
                  <img src="/assets/img/usr/avatar/1001@2x.png" alt="" />
                </span>
                <div>
                  <span class="text">
                    You have been invited to a chat by <b>Megread</b>
                  </span>
                  <span class="when">2 hours ago</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
{
  /* <div>
        <div>
          Notifcations
          <a href={null} style={{ float: "right" }}>
            See All
          </a>
        </div>
        <div
          style={{
            height: "19vh",
            overflow: "hidden",
            overflowY: "scroll",
            backgroundColor: "#fff"
          }}
        >
          {this.handleNoticeMenu({ notifications })}
        </div>
        <div style={{ height: "2vh", backgroundColor: "#fff" }}>See All</div>
      </div> */
}
export default withRouter(NoticesList);
