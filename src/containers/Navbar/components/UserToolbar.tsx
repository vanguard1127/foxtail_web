import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import produce from "immer";

import {
  READ_NOTIFICATION,
  GET_COUNTS,
  CONVERT_COUPLE,
  GET_NOTIFICATIONS
} from "queries";
import Spinner from "components/common/Spinner";
import { IUser } from "types/user";

import NoticesMenu from "./NoticesMenu";
import InboxItem from "./InboxItem";
import Alert from "./Alert";
import MyAccountItem from "./MyAccountItem";
import { IGetCountsData, IAlertData } from './NavbarAuth';

interface IUserToolbarProps {
  currentUser: IUser;
  counts: IGetCountsData;
  ErrorHandler: any;
  blinkInbox: boolean;
  history: any;
  dayjs: any;
  t: any;
}

const UserToolbar: React.FC<IUserToolbarProps> = ({
  currentUser,
  counts,
  ErrorHandler,
  blinkInbox,
  history,
  dayjs,
  t,
}) => {
  const { msgsCount, noticesCount } = counts;

  const [alertVisible, setAlertVisible] = useState<boolean>(true);
  const [alert, setAlert] = useState<IAlertData | null>(counts.alert);

  const [updateNotifications, { loading: mutationLoading }] = useMutation(
    READ_NOTIFICATION,
    {
      update(cache) {
        updateRead(cache);
      }
    }
  );
  const updateRead = cache => {
    const { getCounts } = cache.readQuery({
      query: GET_COUNTS
    });

    let newCounts = { ...getCounts };
    if (newCounts.alert && !newCounts.alert.read) {
      newCounts.alert = null;

      cache.writeQuery({
        query: GET_COUNTS,
        data: {
          getCounts: { ...newCounts }
        }
      });
    }
  };

  const [
    convertToCouple,
    { loading: cplLoading, data: isCoupleOK }
  ] = useMutation(CONVERT_COUPLE, {
    update(cache) {
      const { getCounts } = cache.readQuery({
        query: GET_COUNTS
      }) as any;

      if (getCounts.alert && !getCounts.alert.read) {
        const newCounts = { ...getCounts, alert: null };
        cache.writeQuery({
          query: GET_COUNTS,
          data: { getCounts: { ...newCounts } }
        });
      }
    }
  });

  const showAlert = (alert: IAlertData) => {
    setAlertVisible(true);
    setAlert(alert);
  };

  const handleCoupleLink = coupleProID => {
    convertToCouple({ variables: { coupleProID } });
  };

  const handleCloseAlert = () => {
    if (alert) {
      readNotices(alert.id);
    }
    setAlertVisible(false);
    setAlert(null);
  };

  const readNotices = notificationID => {
    updateNotifications({
      variables: { notificationID, both: true },
      update: cache => {
        let query = "getNotifications";
        let found = false;
        //find in cache, TODO The code below will never work
        Object.keys(cache.data.data).forEach(key => {
          if (key === "ROOT_QUERY") {
            Object.keys(cache.data.data[key]).forEach(subkey => {
              if (!found && subkey.match(query)) {
                found = true;
              }
            });
          } else {
            if (!found && key.match(query)) {
              found = true;
            }
          }
        });

        if (!found) {
          return;
        }

        const {
          getNotifications, getNotifications: { notifications }
        } = cache.readQuery({ query: GET_NOTIFICATIONS }) as any;

        const newNotifications = produce(notifications, draftState => {
          var readNotice = draftState.find(
            notice => notice.id === notificationID
          );

          if (readNotice) {
            readNotice.read = true;
            if (!readNotice.seen) {
              const { getCounts } = cache.readQuery({ query: GET_COUNTS }) as any;
              const newCounts = { ...getCounts, noticesCount: 0 };
              cache.writeQuery({
                query: GET_COUNTS,
                data: { getCounts: { ...newCounts } }
              });
            }
          }
        });

        cache.writeQuery({
          query: GET_NOTIFICATIONS,
          data: {
            getNotifications: {
              ...getNotifications,
              notifications: newNotifications
            }
          }
        });
      }
    });
  };
  if (cplLoading) {
    document.title = t("common:Loading") + "...";
    return <Spinner message={t("common:Loading")} size="large" />;
  }
  if (isCoupleOK) {
    window.location.reload(false);
  }

  return (
    <div className="function">
      {alertVisible && alert && (
        <Alert
          alert={alert}
          close={handleCloseAlert}
          t={t}
          visible={true}
        />
      )}
      <ErrorHandler.ErrorBoundary>
        <InboxItem
          count={msgsCount}
          t={t}
          data-name="inbox"
          userID={currentUser.userID}
          blinkInbox={blinkInbox}
        />
      </ErrorHandler.ErrorBoundary>
      <ErrorHandler.ErrorBoundary>
        {mutationLoading ? (
          <span>
            <div className="notification">
              <span className="icon alert" />
            </div>
          </span>
        ) : (
            <NoticesMenu
              history={history}
              ErrorHandler={ErrorHandler}
              count={noticesCount}
              t={t}
              showAlert={showAlert}
              handleCoupleLink={handleCoupleLink}
              readNotices={readNotices}
              dayjs={dayjs}
            />
          )}
      </ErrorHandler.ErrorBoundary>
      <ErrorHandler.ErrorBoundary>
        <div className="user hidden-mobile">
          <MyAccountItem
            currentUser={currentUser}
            t={t}
          />
        </div>
      </ErrorHandler.ErrorBoundary>
    </div>
  );
};

export default UserToolbar;
