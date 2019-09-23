import React, { Component } from "react";

import NoticesItem from "./NoticesItem";
import InboxItem from "./InboxItem";
import Alert from "./Alert";
import MyAccountItem from "./MyAccountItem";

class UserToolbar extends Component {
  state = { alertVisible: true };
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.counts !== nextProps.counts ||
      this.props.currentuser !== nextProps.currentuser ||
      this.props.href !== nextProps.href ||
      this.props.t !== nextProps.t ||
      this.state.alertVisible !== nextState.alertVisible
    ) {
      return true;
    }
    return false;
  }

  handleCloseAlert = () => {
    this.setState({ alertVisible: false, alert: null });
  };
  render() {
    const { alertVisible } = this.state;
    const {
      currentuser,
      href,
      t,
      setRef,
      counts,
      refetch,
      ErrorHandler,
      msgAudio
    } = this.props;

    let { msgsCount, noticesCount, alert } = counts;

    return (
      <div className="function">
        {alertVisible && alert && (
          <Alert
            alert={alert}
            close={this.handleCloseAlert}
            t={t}
            visible={true}
          />
        )}
        <ErrorHandler.ErrorBoundary>
          <InboxItem
            count={msgsCount}
            active={href === "inbox" && true}
            t={t}
            data-name="inbox"
            ref={setRef}
            userID={currentuser.userID}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>
          <NoticesItem
            recount={refetch}
            ErrorHandler={ErrorHandler}
            t={t}
            msgAudio={msgAudio}
            count={noticesCount}
          />
        </ErrorHandler.ErrorBoundary>
        <ErrorHandler.ErrorBoundary>
          <div className="user hidden-mobile">
            <MyAccountItem currentuser={currentuser} setRef={setRef} t={t} />
          </div>
        </ErrorHandler.ErrorBoundary>
      </div>
    );
  }
}

export default UserToolbar;
