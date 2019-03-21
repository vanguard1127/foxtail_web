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
import { preventContextMenu } from "../../utils/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import validateLang from "../../utils/validateLang";

dayjs.extend(relativeTime);

const LIMIT = 5;
const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  skip: 0,
  visible: false
};

class NoticesList extends Component {
  state = {
    ...intialState
  };

  componentDidMount() {
    this.mounted = true;
    this.props.subscribeToNewNotices();
    const lang = validateLang(localStorage.getItem("i18nextLng"));
    require("dayjs/locale/" + lang);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.skip !== nextState.skip ||
      this.state.visible !== nextState.visible ||
      this.props.notifications !== nextProps.notifications
    ) {
      return true;
    }
    return false;
  }

  clearState = () => {
    if (this.mounted) {
      this.setState({ ...intialState });
    }
  };

  handleEnd = ({ previousPosition, fetchMore }) => {
    //if totoal reach skip and show no more sign
    const { skip } = this.state;
    if (previousPosition === Waypoint.below) {
      if (this.mounted) {
        this.setState(
          state => ({ skip: skip + LIMIT }),
          () => this.fetchData(fetchMore)
        );
      }
    }
  };

  fetchData = fetchMore => {
    if (this.mounted) {
      this.setState({ loading: true });
    }
    fetchMore({
      variables: {
        skip: this.state.skip,
        limit: LIMIT
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          !fetchMoreResult.getNotifications ||
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

  readAndGo = ({ notifications, targetID, type, updateNotifications }) => {
    try {
      const { close } = this.props;
      if (notifications.length !== 0) {
        this.readNotices(notifications, updateNotifications);

        switch (type) {
          case "chat":
            this.props.history.push("/inbox/" + targetID);
            break;
          case "event":
            this.props.history.push("/event/" + targetID);
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

  handleNotice = ({ notif, updateNotifications, t }) => {
    console.log(notif);
    if (notif.type === "alert") {
      return (
        <span onClick={() => this.props.showAlert(notif)}>
          <span className="avatar">
            <img
              src={"../../../images/girl2.jpg"}
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div>
            <span className="text">{t(notif.text)}</span>
            <span className="when">
              {dayjs(notif.date)
                .locale(localStorage.getItem("i18nextLng"))
                .fromNow()}
            </span>
          </div>
        </span>
      );
    } else {
      return (
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
              src={notif.fromProfile.profilePic}
              alt=""
              onContextMenu={preventContextMenu}
            />
          </span>
          <div>
            <span className="text">
              <b> {notif.fromProfile.profileName} </b>
              {t(notif.text)}
            </span>
            <span className="when">
              {dayjs(notif.date)
                .locale(localStorage.getItem("i18nextLng"))
                .fromNow()}
            </span>
          </div>
        </span>
      );
    }
  };

  render() {
    const { t, notifications, updateNotifications, fetchMore } = this.props;

    return (
      <div className="toggle">
        <div className="notification open">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                className={notif.read ? "item read" : "item unread"}
                key={notif.id}
              >
                {this.handleNotice({ notif, updateNotifications, t })}
              </div>
            ))
          ) : (
            <div className="item" key="na">
              <span className="text">No notifcations</span>
            </div>
          )}
          {/* TODO: Use this if fails to waypoint */}
          {/* <div className="item" key="way">
            <Waypoint
              onEnter={({ previousPosition }) => {
                this.handleEnd({ previousPosition, fetchMore });
              }}
              style={{ padding: '5px', backgroundColor: 'blue' }}
            />
            <span className="text">No more notifications :)</span>
          </div> */}
          <div
            key="way"
            style={{ width: "100%", display: "block", float: "left" }}
          >
            <Waypoint
              onEnter={({ previousPosition }) => {
                this.handleEnd({ previousPosition, fetchMore });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(withRouter(NoticesList));
