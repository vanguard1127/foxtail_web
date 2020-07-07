import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";

import { GET_NOTIFICATIONS, GET_COUNTS, NOTICES_SEEN } from "queries";
import Menu from "components/common/Menu";

import NoticesList from "./NoticesList";
import { IAlertData } from "./NavbarAuth";

interface INoticesMenuProps {
  t: any;
  count: number;
  ErrorHandler: any;
  history: any;
  showAlert: (alert: IAlertData) => void;
  // TODO find out coupleProID and notificationID exact type
  handleCoupleLink: (coupleProID: number | string) => void;
  readNotices: (notificationID: number | string) => void;
  dayjs: any;
}

const NoticesMenu: React.FC<INoticesMenuProps> = ({
  t,
  count,
  ErrorHandler,
  history,
  showAlert,
  handleCoupleLink,
  readNotices,
  dayjs
}) => {
  const [noticesSeen] = useMutation(NOTICES_SEEN);
  // TODO type of notifs ?
  const { data, loading, error, subscribeToMore, fetchMore, client } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      limit: parseInt(process.env.REACT_APP_NOTICELIST_LIMIT || "5"),
      isMobile: sessionStorage.getItem("isMobile")
    }
  });

  const updateCount = client => {
    const { cache } = client;
    const { getCounts } = cache.readQuery({ query: GET_COUNTS });
    const newCounts = { ...getCounts, noticesCount: 0 };
    cache.writeQuery({
      query: GET_COUNTS,
      data: { getCounts: { ...newCounts } }
    });
  };

  updateCount(client);
  return (
    <Menu
      activeStyle="notification active"
      notActiveStyle={count > 0 ? "notification active" : "notification"}
      menuOpener={
        <span className="icon alert">
          {count > 0 && <span className="count">{count}</span>}
        </span>
      }
      closeAction={noticesSeen}
    >
      {loading || !data || !data.getNotifications || !data.getNotifications.notifications ? (
        <div className="toggle toggleNotifications">
          <div className="notification open">
            <div className="item" key="na">
              <span className="text">
                {t("Loading")}...
              <span style={{ float: "right" }}>
                  <CircularProgress size={16} />
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : !error ? (
        <NoticesList
          notifications={data.getNotifications.notifications}
          fetchMore={fetchMore}
          subscribeToMore={subscribeToMore}
          readNotices={readNotices}
          history={history}
          ErrorHandler={ErrorHandler}
          t={t}
          dayjs={dayjs}
          showAlert={showAlert}
          handleCoupleLink={handleCoupleLink}
        />
      )
          : <ErrorHandler.report
            error={error}
            calledName={"getNotifications"}
          />
      }
    </Menu>
  );
};

export default NoticesMenu;
