import React, { memo, Fragment, useState, useEffect } from "react";
import { withApollo } from "react-apollo";

import withLocation from "components/HOCs/withLocation";
import Spinner from "components/common/Spinner";
import deleteFromCache from "utils/deleteFromCache";
import { ISession } from "types/user";

import { kinkOptions } from "../../docs/options";

import SearchCriteria from "./SearchCriteria";
import ProfilesContainer from "./ProfilesContainer";

export const Context = React.createContext();

interface ISearchProfilesPageProps {
  t: any;
  ErrorHandler: any;
  refetch: any;
  session: ISession;
  loading: boolean;
  client: any;
  history: any;
  location: any;
  searchCriteria: any;
  locationErr: any;
  ReactGA: any;
  toggleShareModal: () => void;
  dayjs: any;
}

const SearchProfilesPage: React.FC<ISearchProfilesPageProps> = memo(({
  t,
  ErrorHandler,
  refetch,
  session,
  loading,
  client,
  history,
  location,
  searchCriteria,
  locationErr,
  ReactGA,
  toggleShareModal,
  dayjs
}) => {
  console.log('location from withLocation: ', location);
  console.log('session from withsession: ', session);
  console.log('history from withhistory: ', history);
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
    if (location.lat !== undefined) {
      setState({
        ...state,
        lat: location.lat,
        long: location.long,
        city: location.city,
        country: location.country
      });
    }
  }, [location])

  useEffect(() => {
    ErrorHandler.setBreadcrumb("Search Profile Page");
    clearSearchResults();
  }, [])

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
    setState({ ...state, long, lat, city, country });
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
                client={client}
                isBlackMember={session.currentuser.blackMember.active}
                locationErr={locationErr}
                refetchUser={refetch}
                userID={session.currentuser.userID}
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
