import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_NOTIFICATIONS } from "../../queries";
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

const intialState = {
  read: null,
  seen: null,
  notificationIDs: [],
  skip: 0,
  visible: false,
  loading: false
};

class NoticesList extends Component {
  unsubscribe = null;
  fetchMore = null;
  state = {
    ...intialState,
    hasMore: true
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
      this.props.t !== nextProps.t ||
      this.props.count !== nextProps.count ||
      this.state.hasMore !== nextState.hasMore
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
        this.fetchMore({
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
      this.props.readNotices(notificationsIDs);

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
    />
  );

  render() {
    const { t, limit, skip, ErrorHandler } = this.props;
    return (
      <Query
        query={GET_NOTIFICATIONS}
        variables={{ limit, skip }}
        fetchPolicy="cache-and-network"
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          if (
            loading ||
            !data ||
            !data.getNotifications ||
            !data.getNotifications.notifications
          ) {
            return null;
          } else if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getNotifications"}
              />
            );
          } else if (!data.getNotifications.notifications.length === 0) {
            return <div>{t("nonots")} :)</div>;
          }
          const notifications = data.getNotifications.notifications;

          if (!this.unsubscribe) {
            this.unsubscribe = subscribeToMore({
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
          }

          if (!fetchMore) {
            this.fetchMore = fetchMore;
          }
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
                  <div
                    className="item"
                    style={{ textAlign: "center" }}
                    key="na"
                  >
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
        }}
      </Query>
    );
  }
}

export default NoticesList;
