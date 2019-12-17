import React, { Component } from "react";
import produce from "immer";
import { NEW_NOTICE_SUB } from "../../queries";
import { Waypoint } from "react-waypoint";
import getLang from "../../utils/getLang";
import Notice from "./Notice";
const lang = getLang();

class NoticesList extends Component {
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
        const { notifications } = this.props;

        this.props.fetchMore({
          variables: {
            cursor: notifications[notifications.length - 1].date,
            limit: parseInt(process.env.REACT_APP_NOTICELIST_LIMIT)
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.setState({ loading: false });

            if (
              !fetchMoreResult ||
              !fetchMoreResult.getNotifications ||
              fetchMoreResult.getNotifications.notifications.length === 0
            ) {
              this.setState({ hasMore: false });

              return;
            }

            const newNotifications = produce(previousResult, draftState => {
              draftState.getNotifications.notifications = [
                ...previousResult.getNotifications.notifications,
                ...fetchMoreResult.getNotifications.notifications
              ];
            });

            return newNotifications;
          }
        });
      });
    }
  };

  subscribeToInbox = () =>
    (this.unsubscribe = this.props.subscribeToMore({
      document: NEW_NOTICE_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        const { newNoticeSubscribe } = subscriptionData.data;

        if (!newNoticeSubscribe) {
          return prev;
        }

        const newNotifications = produce(prev, draftState => {
          draftState.getNotifications.notifications = [
            newNoticeSubscribe,
            ...prev.getNotifications.notifications
          ];
        });

        return newNotifications;
      }
    }));

  markReadAndGo = ({ notificationID, targetID, type }) => {
    try {
      this.props.readNotices(notificationID);

      switch (type) {
        case "chat":
          this.props.history.replace({
            pathname: "/inbox",
            state: { chatID: targetID }
          });
          window.location.reload(false);
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
      dayjs={this.props.dayjs}
      lang={lang}
      showAlert={this.props.showAlert}
      handleCoupleLink={this.props.handleCoupleLink}
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

export default NoticesList;
