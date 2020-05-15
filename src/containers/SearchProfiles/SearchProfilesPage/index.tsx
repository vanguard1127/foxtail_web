import React, { memo, Fragment, useState, useEffect } from "react";
import { withApollo } from "react-apollo";

import withLocation from "components/HOCs/withLocation";
import Spinner from "components/common/Spinner";
import deleteFromCache from "utils/deleteFromCache";
import { ISession } from "types/user";

import { kinkOptions } from "../../../docs/options";

import SearchCriteria from "../SearchCriteria";
import ProfilesContainer from "../ProfilesContainer";

export const Context = React.createContext();

interface ISearchProfilesPageProps {
  history: any;
  loading: boolean;
  t: any;
  ErrorHandler: any;
  searchCriteria: any;
  ReactGA: any;
  session: ISession;
  toggleShareModal: () => void;
  dayjs: any;
  client: any;
  location: any;
  refetch: any;
}

const SearchProfilesPage: React.FC<ISearchProfilesPageProps> = memo(({
  history,
  loading,
  t,
  ErrorHandler,
  searchCriteria,
  ReactGA,
  session,
  toggleShareModal,
  dayjs,
  client,
  location,
}) => {
  const [state, setState] = useState<any>({
    lat: location.lat,
    long: location.long,
    city: location.city || searchCriteria.city,
    country: location.country || searchCriteria.country,
    distance: searchCriteria.distance,
    distanceMetric: searchCriteria.distanceMetric,
    ageRange: searchCriteria.ageRange,
    interestedIn: searchCriteria.interestedIn,
    lang: searchCriteria.lang,
  })

  useEffect(() => {
    if (state.lat !== location.lat) {
      setState({
        ...state,
        lat: location.lat,
        long: location.long,
        city: location.city,
        country: location.country
      });
    }
  })

  useEffect(() => {
    ErrorHandler.setBreadcrumb("Search Profile Page");
    clearSearchResults();
  }, []);

  const clearSearchResults = () => {
    ErrorHandler.setBreadcrumb("Clear results");
    const { cache } = client;
    deleteFromCache({ cache, query: "searchProfiles" });
  };

  const setValue = ({ name, value }) => {
    setState({ ...state, [name]: value });
  };

  const setLocation = ({ lat, long, city, country }) => {
    ErrorHandler.setBreadcrumb(
      "Set Location: lat:" + lat + " long:" + long
    );
    setState({ ...state, lat, long, city, country });
  };

  const {
    lat,
    long,
    city,
    country,
    distance,
    distanceMetric,
    ageRange,
    lang,
    interestedIn,
  } = state;

  return (
    <Fragment>
      <ErrorHandler.ErrorBoundary>
        <SearchCriteria
          loading={loading}
          t={t}
          setLocation={setLocation}
          setValue={setValue}
          lat={lat}
          long={long}
          lang={lang}
          distance={distance}
          distanceMetric={distanceMetric}
          ageRange={ageRange}
          interestedIn={interestedIn}
          city={city}
          country={country}
          ErrorHandler={ErrorHandler}
          isBlackMember={session.currentuser.blackMember.active}
          ReactGA={ReactGA}
        />
      </ErrorHandler.ErrorBoundary>
      <ErrorHandler.ErrorBoundary>
        {!lat || !session ? <Spinner message={t("common:Loading")} size="large" />
          : (
            <Context.Provider value={{ kinkOptions }}>
              <ProfilesContainer
                loading={loading}
                t={t}
                history={history}
                lat={lat}
                long={long}
                distance={distance}
                distanceMetric={session.currentuser.distanceMetric}
                likesSent={session.currentuser.likesSent}
                // TODO add msgsSent to IUser, after backend add
                msgsSent={session.currentuser.msgsSent}
                ageRange={ageRange}
                interestedIn={interestedIn}
                ErrorHandler={ErrorHandler}
                dayjs={dayjs}
                isBlackMember={session.currentuser.blackMember.active}
                ReactGA={ReactGA}
                toggleShareModal={toggleShareModal}
              />
            </Context.Provider>
          )}
      </ErrorHandler.ErrorBoundary>
    </Fragment>
  );
})

export default withApollo(withLocation(SearchProfilesPage));
