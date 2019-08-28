import React, { Component } from "react";
import { NOTICELIST_LIMIT } from "../../docs/consts";
import { NEW_NOTICE_SUB } from "../../queries";
import { Waypoint } from "react-waypoint";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getLang from "../../utils/getLang";
import Notice from "./Notice";
import Alert from "./Alert";
const lang = getLang();
require("dayjs/locale/" + lang);
dayjs.extend(relativeTime);

const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  skip: 0,
  visible: false,
  loading: false,
  alertVisible: false,
  userAlert: null
};

class NoticesList extends Component {
  state = {
    ...intialState,
    hasMore: true,
    userNotifications: this.props.datanotifications
  };

  componentDidMount() {
    this.mounted = true;
    this.subscribeToNewNotices();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    if (
      this.state.skip !== nextState.skip ||
      this.state.visible !== nextState.visible ||
      this.props.notifications !== nextProps.notifications ||
      this.state.loading !== nextState.loading ||
      this.props.t !== nextProps.t ||
      this.props.count !== nextProps.count ||
      this.state.alertVisible !== nextState.alertVisible ||
      this.state.hasMore !== nextState.hasMore ||
      this.state.userAlert !== nextState.userAlert
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

  noMoreItems = () => {
    if (this.mounted) {
      this.setState({ hasMore: false });
    }
  };

  handleVisibleChange = flag => {
    if (this.mounted) {
      this.setState({ visible: flag });
    }
  };

  handleEnd = ({ previousPosition }) => {
    //if total reached skip and show no more sign
    if (this.state.hasMore) {
      const { skip } = this.state;
      if (previousPosition === Waypoint.below) {
        if (this.mounted) {
          this.setState({ skip: skip + NOTICELIST_LIMIT, loading: true }, () =>
            this.fetchData()
          );
        }
      }
    }
  };

  fetchData = () => {
    if (this.mounted) {
      this.setState({ loading: true }, () =>
        this.props.fetchMore({
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
            this.setState({ userNotifications: previousResult });
            return previousResult;
          }
        })
      );
    }
  };

  markReadAndGo = ({ notificationsIDs, targetID, type }) => {
    try {
      this.readNotices(notificationsIDs);

      switch (type) {
        case "chat":
          this.props.history.replace({
            pathname: "/inbox",
            state: { chatID: targetID }
          });
          break;
        case "event":
          this.props.history.replace(`/event/${targetID}`);
          break;
        default:
          break;
      }
    } catch (e) {
      this.props.ErrorHandler.catchErrors(e); /* Error handling */
    }
  };

  handleNotice = ({ notice }) => (
    <Notice
      key={notice.id}
      notice={notice}
      t={this.props.t}
      dayjs={dayjs}
      lang={lang}
      setAlert={this.setAlert}
    />
  );

  setAlert = ({ alert }) => {
    if (this.mounted) {
      console.log("ALERT:", alert);

      this.setState({ userAlert: alert, alertVisible: true });
      console.log("after");
    }
  };

  handleCloseAlert = notificationID => {
    if (this.mounted) {
      this.readNotices([notificationID]);
      this.setState({
        alertVisible: false,
        userAlert: null
      });
    }
  };

  readNotices = notificationIDs => {
    console.log("READ NOTICES");
    if (this.mounted) {
      this.setState({ notificationIDs, read: true }, () => {
        this.props
          .updateNotifications()
          .then(({ data }) => {
            this.clearState();
          })
          .catch(res => {
            this.props.ErrorHandler.catchErrors(res.graphQLErrors);
          });
      });
    }
  };

  subscribeToNewNotices = () =>
    this.props.subscribeToMore({
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
        this.setState({ userNotifications: prev });
        return prev;
      }
    });

  render() {
    const { t } = this.props;
    const { alertVisible, userNotifications } = this.state;
    const { notifications, alert } = userNotifications;

    return (
      <div className="toggle toggleNotifications">
        {alertVisible && (
          <Alert
            alert={alert}
            close={() => this.handleCloseAlert(alert.id)}
            t={t}
          />
        )}
        <div className="notification open">
          {notifications.length > 0 ? (
            notifications.map(notice => this.handleNotice({ notice }))
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
                this.handleEnd({ previousPosition });
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

export default NoticesList;
