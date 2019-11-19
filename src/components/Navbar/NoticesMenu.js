import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_NOTIFICATIONS } from "../../queries";
import Menu from "../common/Menu";
import NoticesList from "./NoticesList";

class NoticesMenu extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.t !== nextProps.t || this.props.count !== nextProps.count) {
      return true;
    }
    return false;
  }

  render() {
    const {
      t,
      updateNotifications,
      count,
      ErrorHandler,
      history,
      setAlert,
      readNotices,
      limit,
      skip,
      recount,
      skipForward,
      resetSkip
    } = this.props;

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
          variables={{ limit, skip }}
          fetchPolicy="network-only"
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
                      <span className="text">{t("Loading")}...</span>
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
                updateNotifications={updateNotifications}
                subscribeToMore={subscribeToMore}
                fetchMore={fetchMore}
                t={t}
                ErrorHandler={ErrorHandler}
                setAlert={setAlert}
                readNotices={readNotices}
                limit={limit}
                skip={skip}
                recount={recount}
                notifications={data.getNotifications.notifications}
                skipForward={skipForward}
                resetSkip={resetSkip}
              />
            );
          }}
        </Query>
      </Menu>
    );
  }
}

export default NoticesMenu;
