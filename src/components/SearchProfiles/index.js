// @flow
import React, { Component } from "react";
import { Query } from "react-apollo";
import { GET_SEARCH_SETTINGS } from "../../queries";
import SearchProfilesPage from "./SearchProfilesPage";
import ShareModal from "../Modals/Share";
import OnboardModal from "../Modals/Onboard";
import Spinner from "../common/Spinner";
import { withTranslation } from "react-i18next";

class SearchProfiles extends Component {
  state = {
    shareModalVisible: false,
    onboardModalVisible: true
  };
  componentDidMount() {
    window.scrollTo(0, 1);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.tReady !== nextProps.tReady ||
      this.state.shareModalVisible !== nextState.shareModalVisible ||
      this.state.onboardModalVisible !== nextState.onboardModalVisible
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

  render() {
    const { shareModalVisible, onboardModalVisible } = this.state;
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
              {shareModalVisible && (
                <ShareModal
                  userID={session.currentuser.userID}
                  visible={shareModalVisible}
                  close={this.toggleShareModal}
                  ErrorBoundary={ErrorHandler.ErrorBoundary}
                  t={t}
                />
              )}
              {/* {onboardModalVisible && (
                <OnboardModal
                  visible={shareModalVisible}
                  ErrorHandler={ErrorHandler}
                  t={t}
                />
              )} */}
            </>
          );
        }}
      </Query>
    );
  }
}

export default withTranslation("searchprofiles")(SearchProfiles);
