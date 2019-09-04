import React, { Component } from "react";
import { GET_COUNTS, NEW_NOTICE_SUB, NEW_INBOX_SUB } from "../../queries";
import { Query } from "react-apollo";
import NoticesItem from "./NoticesItem";
import InboxItem from "./InboxItem";
import Alert from "./Alert";
import MyAccountItem from "./MyAccountItem";
import * as ErrorHandler from "../common/ErrorHandler";
var msgAudio = new Audio(require("../../docs/msg.mp3"));

class UserToolbar extends Component {
  unsubscribe = null;
  state = { alertVisible: true };
  shouldComponentUpdate(nextProps, nextState) {
    if (
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
    const { currentuser, href, t, setRef } = this.props;
    return (
      <Query query={GET_COUNTS} fetchPolicy="cache-first">
        {({ data, loading, error, refetch, subscribeToMore }) => {
          if (loading || !data) {
            return (
              <div className="function">
                <InboxItem t={t} />
                <div className="notification" />
                <div className="user hidden-mobile" />
                <MyAccountItem t={t} />
              </div>
            );
          }

          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getCounts"}
                userID={currentuser.userID}
              />
            );
          }

          let { msgsCount, noticesCount, alert } = data.getCounts;

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
                  msgAudio={msgAudio}
                  subscribeToMore={subscribeToMore}
                  userID={currentuser.userID}
                />
              </ErrorHandler.ErrorBoundary>
              <ErrorHandler.ErrorBoundary>
                <NoticesItem
                  subscribeToMore={subscribeToMore}
                  recount={refetch}
                  ErrorHandler={ErrorHandler}
                  t={t}
                  msgAudio={msgAudio}
                  count={noticesCount}
                />
              </ErrorHandler.ErrorBoundary>
              <ErrorHandler.ErrorBoundary>
                <div className="user hidden-mobile">
                  <MyAccountItem
                    currentuser={currentuser}
                    setRef={setRef}
                    t={t}
                  />
                </div>
              </ErrorHandler.ErrorBoundary>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default UserToolbar;
