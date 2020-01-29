// @flow
import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_SEARCH_SETTINGS } from "../../queries";
import { withRouter } from "react-router-dom";
import SearchProfilesPage from "./SearchProfilesPage";
import ShareModal from "../Modals/Share";
import WelcomeModal from "../Modals/Welcome";
import Spinner from "../common/Spinner";
import { withTranslation } from "react-i18next";

class SearchProfiles extends Component {
  state = {
    shareModalVisible: false,
    welcomeModalVisible:
      this.props.location.state && this.props.location.state.initial
  };
  componentDidMount() {
    window.scrollTo(0, 1);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.tReady !== nextProps.tReady ||
      this.state.shareModalVisible !== nextState.shareModalVisible ||
      this.state.welcomeModalVisible !== nextState.welcomeModalVisible
    ) {
      return true;
    }
    return false;
  }

  toggleShareModal = () => {
    this.props.ErrorHandler.setBreadcrumb("Share Modal Toggled:");
    if (!this.state.shareModalVisible) {
      this.props.ReactGA.event({
        category: "Search Profiles",
        action: "Share Modal"
      });
    }
    this.setState({ shareModalVisible: !this.state.shareModalVisible });
  };

  toggleWelcomeModal = () => {
    this.props.ErrorHandler.setBreadcrumb("Welcome Modal Toggled:");
    if (!this.state.welcomeModalVisible) {
      this.props.ReactGA.event({
        category: "Welcome Messages Seen",
        action: "Welcome Modal"
      });
    }
    this.props.history.replace({ state: {} });
    this.setState({ welcomeModalVisible: !this.state.welcomeModalVisible });
  };

  render() {
    const { shareModalVisible, welcomeModalVisible } = this.state;
    const {
      t,
      ErrorHandler,
      ReactGA,
      tReady,
      refetch,
      session,
      dayjs
    } = this.props;

    if (!tReady) {
      return <Spinner />;
    }
    ErrorHandler.setBreadcrumb("Enter Search Profiles");
    return (
      <Query
        query={GET_SEARCH_SETTINGS}
        fetchPolicy="cache-and-network"
        returnPartialData={true}
      >
        {({ data, loading, error, refetch: { refetchSettings } }) => {
          if (error) {
            return (
              <ErrorHandler.report
                error={error}
                calledName={"getSearchSettings"}
              />
            );
          }
          if (!data || !data.getSettings || loading) {
            return null;
          }
          return (
            <>
              <SearchProfilesPage
                refetchSettings={refetchSettings}
                loading={loading}
                t={t}
                ErrorHandler={ErrorHandler}
                searchCriteria={data.getSettings}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                toggleShareModal={this.toggleShareModal}
                dayjs={dayjs}
              />
              {welcomeModalVisible && (
                <WelcomeModal
                  visible={welcomeModalVisible}
                  close={this.toggleWelcomeModal}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                  t={t}
                />
              )}
              {shareModalVisible && (
                <ShareModal
                  userID={session.currentuser.userID}
                  visible={shareModalVisible}
                  close={this.toggleShareModal}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                  t={t}
                />
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(withTranslation("searchprofiles")(SearchProfiles));
