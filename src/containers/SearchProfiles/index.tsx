import React, { memo, useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";

import { GET_SEARCH_SETTINGS } from "queries";
import ShareModal from "components/Modals/Share";
import WelcomeModal from "components/Modals/Welcome";
import Spinner from "components/common/Spinner";
import { ISession } from "types/user";

import SearchProfilesPage from "./SearchProfilesPage";

interface ISearchProfilesProps extends WithTranslation, RouteComponentProps {
  ErrorHandler: any;
  ReactGA: any;
  session: ISession;
  dayjs: any;
  refetch: any;
}

const SearchProfiles: React.FC<ISearchProfilesProps> = memo(({
  ErrorHandler,
  ReactGA,
  history,
  location,
  t,
  tReady,
  refetch,
  session,
  dayjs
}) => {
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState<any>(location.state && location.state.initial);

  const { data, loading, error } = useQuery(GET_SEARCH_SETTINGS, {
    fetchPolicy: 'cache-and-network',
    returnPartialData: true
  })

  useEffect(() => {
    window.scrollTo(0, 1);
  }, [])

  const toggleShareModal = () => {
    ErrorHandler.setBreadcrumb("Share Modal Toggled:");
    if (!shareModalVisible) {
      ReactGA.event({
        category: "Search Profiles",
        action: "Share Modal"
      });
    }
    setShareModalVisible(!shareModalVisible);
  };

  const toggleWelcomeModal = () => {
    ErrorHandler.setBreadcrumb("Welcome Modal Toggled:");
    if (!welcomeModalVisible) {
      ReactGA.event({
        category: "Welcome Messages Seen",
        action: "Welcome Modal"
      });
    }
    setWelcomeModalVisible(!welcomeModalVisible);
    history.replace({ state: {} });
  };

  if (!tReady) {
    return <Spinner />;
  }
  ErrorHandler.setBreadcrumb("Enter Search Profiles");

  if (!data || !data.getSettings || loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorHandler.report
        error={error}
        calledName={"getSearchSettings"}
      />
    );
  }

  return (
    <React.Fragment>
      <SearchProfilesPage
        history={history}
        loading={loading}
        t={t}
        ErrorHandler={ErrorHandler}
        searchCriteria={data.getSettings}
        ReactGA={ReactGA}
        session={session}
        refetch={refetch}
        toggleShareModal={toggleShareModal}
        dayjs={dayjs}
      />
      {welcomeModalVisible && (
        <WelcomeModal
          visible={welcomeModalVisible}
          close={toggleWelcomeModal}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
          t={t}
        />
      )}
      {shareModalVisible && (
        <ShareModal
          userID={session.currentuser.userID}
          visible={shareModalVisible}
          close={toggleShareModal}
          ErrorBoundary={ErrorHandler.ErrorBoundary}
          t={t}
        />
      )}
    </React.Fragment>
  );
});

export default withRouter(withTranslation("searchprofiles")(SearchProfiles));
