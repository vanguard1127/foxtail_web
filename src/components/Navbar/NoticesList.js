import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NOTICELIST_LIMIT } from "../../docs/consts";
import { Waypoint } from "react-waypoint";
import { preventContextMenu } from "../../utils/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getLang from "../../utils/getLang";
const lang = getLang();
require("dayjs/locale/" + lang);
dayjs.extend(relativeTime);

const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  skip: 0,
  visible: false,
  loading: false
};

class NoticesList extends Component {
  state = {
    ...intialState,
    hasMore: this.props.hasMore
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.skip !== nextState.skip ||
      this.state.visible !== nextState.visible ||
      this.props.notifications !== nextProps.notifications ||
      this.state.loading !== nextState.loading ||
      this.props.t !== nextProps.t
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
    if (this.state.hasMore) {
      const { skip } = this.state;
      if (previousPosition === Waypoint.below) {
        if (this.mounted) {
          this.setState(
            state => ({ skip: skip + NOTICELIST_LIMIT, loading: true }),
            () => this.fetchData(fetchMore)
          );
        }
      }
    }
  };

  fetchData = fetchMore => {
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        fetchMore({
          variables: {
            skip: this.state.skip,
            limit: NOTICELIST_LIMIT
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (this.mounted) {
              this.setState({ loading: false });
            }

            if (
              !fetchMoreResult ||
              !fetchMoreResult.getNotifications ||
              fetchMoreResult.getNotifications.notifications.length === 0
            ) {
              this.setState({ hasMore: false });
              this.props.noMoreItems();
              return;
            }
            previousResult.getNotifications.notifications = [
              ...previousResult.getNotifications.notifications,
              ...fetchMoreResult.getNotifications.notifications
            ];
            return previousResult;
          }
        })
      );
    }
  };

  readAndGo = ({ notifications, targetID, type }) => {
    try {
      const { close } = this.props;
      if (notifications.length > 0) {
        this.props.readNotices(notifications);

        switch (type) {
          case "chat":
            console.log("called");
            this.props.history.replace({
              pathname: "/inbox",
              state: { chatID: targetID }
            });
            break;
          case "event":
            //TODO: MAke this work like Chat above to stop using window.load
            //this.props.history.replace(`/event/${targetID}`);
            window.location.replace("/event/" + targetID);
            break;
          default:
            break;
        }
        close();
      }
    } catch (e) {
      const ErrorHandler = require("../common/ErrorHandler");
      ErrorHandler.catchErrors(e); /* Error handling */
    }
  };

  handleNotice = ({ notif, t }) => {
    if (notif.type === "alert") {
      return (
        <div
          className={notif.read ? "item read" : "item unread"}
          key={notif.id}
          onClick={() => this.props.showAlert(notif)}
        >
          <span>
            <span className="avatar">
              <img
                src={"../assets/img/no-profile.png"}
                alt=""
                onContextMenu={preventContextMenu}
              />
            </span>
            <div>
              <span className="text">
                {notif.name && notif.name + " "}
                {t(notif.text)}
                {notif.event && " " + notif.event}
              </span>
              <span className="when">
                {dayjs(notif.date)
                  .locale(lang)
                  .fromNow()}
              </span>
            </div>
          </span>
        </div>
      );
    } else {
      return (
        <div
          className={notif.read ? "item read" : "item unread"}
          key={notif.id}
          onClick={() =>
            this.readAndGo({
              notifications: [notif.id],
              targetID: notif.targetID,
              type: notif.type
            })
          }
        >
          <span>
            <span className="avatar">
              <img
                src={notif.fromProfile ? notif.fromProfile.profilePic : ""}
                onContextMenu={preventContextMenu}
                className="avatar"
                alt="avatar"
              />
            </span>
            <div>
              <span className="text">
                <b>
                  {notif.fromProfile ? notif.fromProfile.profileName : ""}
                  {notif.name}{" "}
                </b>
                {t(notif.text)}
                {notif.event && " " + notif.event}
              </span>
              <span className="when">
                {dayjs(notif.date)
                  .locale(lang)
                  .fromNow()}
              </span>
            </div>
          </span>
        </div>
      );
    }
  };

  render() {
    const { t, notifications, fetchMore } = this.props;

    return (
      <div className="toggle toggleNotifications">
        <div className="notification open">
          {notifications.length > 0 ? (
            notifications.map(notif => this.handleNotice({ notif, t }))
          ) : (
            <div className="item" key="na">
              <span className="text">{t("nonotif")}</span>
            </div>
          )}

          <div
            key="way"
            style={{
              width: "100%",
              display: "block",
              float: "left"
            }}
          >
            <Waypoint
              onEnter={({ previousPosition }) => {
                this.handleEnd({ previousPosition, fetchMore });
              }}
            />
          </div>
          {notifications.length > 0 ? (
            <div className="item" style={{ textAlign: "center" }} key="na">
              {this.state.loading ? (
                <span className="text">{t("Loading")}</span>
              ) : (
                <span className="text">{t("nonotif")}</span>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(NoticesList);
