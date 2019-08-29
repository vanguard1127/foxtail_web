import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_NOTIFICATIONS } from "../../queries";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getLang from "../../utils/getLang";
import NoticesListItems from "./NoticesListItems";
const lang = getLang();
require("dayjs/locale/" + lang);
dayjs.extend(relativeTime);

class NoticesList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.t !== nextProps.t ||
      this.props.skip !== nextProps.skip ||
      this.props.limit !== nextProps.limit
    ) {
      return true;
    }
    return false;
  }

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
            return (
              <div className="item" style={{ textAlign: "center" }} key="na">
                <span className="text">{t("Loading")}</span>
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
            <NoticesListItems
              notifications={data.getNotifications.notifications}
              t={t}
              subscribeToMore={subscribeToMore}
              fetchMore={fetchMore}
              ErrorHandler={ErrorHandler}
              limit={limit}
              skip={skip}
            />
          );
        }}
      </Query>
    );
  }
}

export default NoticesList;
