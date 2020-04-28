import React, { useState, useEffect, memo } from "react";
import { Waypoint } from "react-waypoint";
import produce from "immer";

import { NEW_NOTICE_SUB } from "queries";
import getLang from "utils/getLang";

import Notice from "./Notice";
import { IAlertData } from "./NavbarAuth";

const lang = getLang();

interface INoticesListProps {
  notifications: any;
  fetchMore: any;
  subscribeToMore: any;
  readNotices: (notificationID: number | string) => void;
  history: any;
  ErrorHandler: any;
  t: any;
  dayjs: any;
  showAlert: (alert: IAlertData) => void;
  handleCoupleLink: (coupleProID: number | string) => void
}

const NoticesList: React.FC<INoticesListProps> = memo(({
  notifications,
  fetchMore,
  subscribeToMore,
  readNotices,
  history,
  ErrorHandler,
  t,
  dayjs,
  showAlert,
  handleCoupleLink
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    subscribeToInbox();
  }, [])

  const handleEnd = ({ previousPosition }) => {
    //if total reached skip and show no more sign
    if (hasMore) {
      if (previousPosition === Waypoint.below) {
        fetchData();
      }
    }
  };

  const fetchData = () => {
    setLoading(true);
    const limit = parseInt(process.env.REACT_APP_NOTICELIST_LIMIT || "5");
    fetchMore({
      variables: {
        cursor: notifications[notifications.length - 1].date,
        limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        setLoading(false);
        if (
          !fetchMoreResult ||
          !fetchMoreResult.getNotifications ||
          fetchMoreResult.getNotifications.notifications.length < limit
        ) {
          setHasMore(false);
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
  };

  const subscribeToInbox = () =>
    subscribeToMore({
      document: NEW_NOTICE_SUB,
      variables: {
        isMobile: sessionStorage.getItem("isMobile")
      },
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
    });

  const markReadAndGo = ({ notificationID, targetID, type }) => {
    try {
      readNotices(notificationID);
      switch (type) {
        case "chat":
          if (~window.location.href.indexOf("/inbox")) {
            history.replace({
              pathname: "/inbox",
              state: { chatID: targetID }
            });
            window.location.reload(false);
          } else {
            history.replace({
              pathname: "/inbox",
              state: { chatID: targetID }
            });
          }
          break;
        case "event":
          history.replace(`/event/${targetID}`);
          break;
        default:
          break;
      }
    } catch (e) {
      ErrorHandler.catchErrors(e); /* Error handling */
    }
  };

  const handleNotice = ({ notice }) => (
    <Notice
      key={notice.id}
      notice={notice}
      t={t}
      dayjs={dayjs}
      lang={lang}
      showAlert={showAlert}
      handleCoupleLink={handleCoupleLink}
      markReadAndGo={markReadAndGo}
    />
  );

  return (
    <div className="toggle toggleNotifications">
      <div className="notification open">
        {notifications.length > 0 ? (
          notifications.map(notice => handleNotice({ notice }))
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
              handleEnd({ previousPosition });
            }}
          />
        </div>
        {notifications.length > 0 ? (
          <div className="item" style={{ textAlign: "center" }} key="na">
            {loading ? (<span className="text">{t("Loading")}</span>)
              : (<span className="text">{t("nonotif")}</span>)}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default NoticesList;
