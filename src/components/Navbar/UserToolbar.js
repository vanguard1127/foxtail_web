import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { READ_NOTIFICATION, GET_COUNTS } from "../../queries";
import NoticesMenu from "./NoticesMenu";
import InboxItem from "./InboxItem";
import Alert from "./Alert";
import MyAccountItem from "./MyAccountItem";

const UserToolbar = ({
  currentuser,
  href,
  t,
  setRef,
  counts,
  refetch,
  ErrorHandler,
  blinkInbox,
  history
}) => {
  let { msgsCount, noticesCount } = counts;
  const [alertVisible, setAlertVisible] = useState(true);
  const [alert, setAlert] = useState(counts.alert);
  const [skip, setSkip] = useState(0);

  const skipForward = () => {
    const newSkip = skip + parseInt(process.env.REACT_APP_NOTICELIST_LIMIT);
    setSkip(newSkip);
    return newSkip;
  };

  const resetSkip = () => {
    setSkip(0);
  };

  const showAlert = alert => {
    setAlertVisible(true);
    setAlert(alert);
  };

  const handleCloseAlert = () => {
    readNotices(alert.id);
    setAlertVisible(false);
    setAlert(null);
  };

  const [updateNotifications, { loading: mutationLoading }] = useMutation(
    READ_NOTIFICATION,
    {
      update(cache) {
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
      }
    }
  );

  const readNotices = notificationID => {
    updateNotifications({
      variables: { notificationID }
    }).catch(res => {
      this.props.ErrorHandler.catchErrors(res);
    });
  };

  return (
    <div className="function">
      {alertVisible && counts.alert && (
        <Alert
          alert={counts.alert}
          close={handleCloseAlert}
          t={t}
          visible={true}
        />
      )}
      {alertVisible && alert && (
        <Alert alert={alert} close={handleCloseAlert} t={t} visible={true} />
      )}
      <ErrorHandler.ErrorBoundary>
        <InboxItem
          count={msgsCount}
          active={href === "inbox" && true}
          t={t}
          data-name="inbox"
          ref={setRef}
          userID={currentuser.userID}
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
            readNotices={readNotices}
            limit={parseInt(process.env.REACT_APP_NOTICELIST_LIMIT)}
            skip={skip}
            recount={refetch}
            skipForward={skipForward}
            resetSkip={resetSkip}
          />
        )}
      </ErrorHandler.ErrorBoundary>
      <ErrorHandler.ErrorBoundary>
        <div className="user hidden-mobile">
          <MyAccountItem currentuser={currentuser} setRef={setRef} t={t} />
        </div>
      </ErrorHandler.ErrorBoundary>
    </div>
  );
};

export default UserToolbar;
