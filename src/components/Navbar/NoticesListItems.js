import React, { Component } from "react";
import { NOTICELIST_LIMIT } from "../../docs/consts";
import { NEW_NOTICE_SUB } from "../../queries";
import { Waypoint } from "react-waypoint";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getLang from "../../utils/getLang";
import Notice from "./Notice";
const lang = getLang();
require("dayjs/locale/" + lang);
dayjs.extend(relativeTime);

class NoticesListItems extends Component {
  state = {
    loading: false,
    hasMore: true
  };

  componentDidMount() {
    this.mounted = true;
    this.subscribeToInbox();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.notifications !== nextProps.notifications ||
      this.state.loading !== nextState.loading ||
      this.props.t !== nextProps.t ||
      this.props.count !== nextProps.count ||
      this.state.hasMore !== nextState.hasMore
    ) {
      return true;
    }
    return false;
  }

  noMoreItems = () => {
    if (this.mounted) {
      this.setState({ hasMore: false });
    }
  };

  handleEnd = ({ previousPosition }) => {
    //if total reached skip and show no more sign
    if (this.state.hasMore) {
      if (previousPosition === Waypoint.below) {
        if (this.mounted) {
          this.fetchData();
        }
      }
    }
  };

  fetchData = () => {
    if (this.mounted) {
      this.setState({ loading: true }, () => {
        const skip = this.props.skipForward();

        this.props.fetchMore({
          variables: {
            skip,
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
            this.props.setNotifications({
              notifications: previousResult.getNotifications.notifications
            });
            return previousResult;
          }
        });
      });
    }
  };

  subscribeToInbox = () =>
    this.mounted &&
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

        this.props.setNotifications({
          notifications: prev.getNotifications.notifications
        });

        return prev;
      }
    });

  markReadAndGo = ({ notificationIDs, targetID, type }) => {
    try {
      this.props.readNotices(notificationIDs);

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
      setAlert={this.props.setAlert}
      markReadAndGo={this.markReadAndGo}
    />
  );

  render() {
    const { t, notifications } = this.props;
    return (
      <div className="toggle toggleNotifications">
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

export default NoticesListItems;
