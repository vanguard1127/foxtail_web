import React, { Component } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import getLang from "../../utils/getLang";
import NoticesListItems from "./NoticesListItems";
const lang = getLang();
require("dayjs/locale/" + lang);
dayjs.extend(relativeTime);

class NoticesList extends Component {
  state = {
    notifications: this.props.notifications
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.t !== nextProps.t ||
      this.props.skip !== nextProps.skip ||
      this.props.limit !== nextProps.limit ||
      this.props.notifications !== nextProps.notifications ||
      this.state.notifications !== nextState.notifications
    ) {
      return true;
    }
    return false;
  }

  setNotifications = ({ notifications }) => {
    this.setState({ notifications });
  };

  render() {
    const {
      t,
      limit,
      skip,
      ErrorHandler,
      history,
      subscribeToMore,
      fetchMore,
      readNotices,
      setAlert,
      skipForward
    } = this.props;
    const { notifications } = this.state;
    return (
      <NoticesListItems
        notifications={notifications}
        t={t}
        subscribeToMore={subscribeToMore}
        fetchMore={fetchMore}
        ErrorHandler={ErrorHandler}
        limit={limit}
        skip={skip}
        history={history}
        setNotifications={this.setNotifications}
        readNotices={readNotices}
        setAlert={setAlert}
        skipForward={skipForward}
      />
    );
  }
}

export default NoticesList;
