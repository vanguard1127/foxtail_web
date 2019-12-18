import React from "react";
import { Query } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_NOTIFICATIONS } from "../../queries";
import Menu from "../common/Menu";
import NoticesList from "./NoticesList";

const NoticesMenu = ({
  t,
  count,
  ErrorHandler,
  history,
  showAlert,
  handleCoupleLink,
  readNotices,
  recount,
  dayjs
}) => {
  return (
    <Menu
      activeStyle="notification active"
      notActiveStyle={count > 0 ? "notification active" : "notification"}
      menuOpener={
        <span className="icon alert">
          {count > 0 && <span className="count">{count}</span>}
        </span>
      }
      closeAction={recount}
    >
      <Query
        query={GET_NOTIFICATIONS}
        variables={{ limit: parseInt(process.env.REACT_APP_NOTICELIST_LIMIT) }}
      >
        {({ data, loading, error, subscribeToMore, fetchMore }) => {
          if (
            loading ||
            !data ||
            !data.getNotifications ||
            !data.getNotifications.notifications
          ) {
            return (
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
            );
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

          return (
            <NoticesList
              history={history}
              subscribeToMore={subscribeToMore}
              fetchMore={fetchMore}
              t={t}
              ErrorHandler={ErrorHandler}
              showAlert={showAlert}
              handleCoupleLink={handleCoupleLink}
              readNotices={readNotices}
              recount={recount}
              notifications={data.getNotifications.notifications}
              dayjs={dayjs}
            />
          );
        }}
      </Query>
    </Menu>
  );
};

export default NoticesMenu;
