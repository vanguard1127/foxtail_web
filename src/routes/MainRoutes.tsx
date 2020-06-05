/* eslint-disable prettier/prettier */
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import dayjs from "dayjs";

import { ISession } from "types/user";
import Loadable from "components/HOCs/Loadable";
import * as ErrorHandler from "components/common/ErrorHandler";
import withAuth from "components/HOCs/withAuth";
import IdleTimer from "components/HOCs/IdleTimer";

import Navbar from "containers/Navbar";

import "components/Header/header.css";

const SearchProfiles = Loadable({ loader: () => import("containers/SearchProfiles") });
const Footer = Loadable({ loader: () => import("components/Footer") });
const Settings = Loadable({ loader: () => import("components/Settings") });
const EventPage = Loadable({ loader: () => import("containers/Event") });
const ProfilePage = Loadable({ loader: () => import("containers/Profile") });
const InboxPage = Loadable({ loader: () => import("containers/Inbox") });
const SearchEvents = Loadable({ loader: () => import("containers/SearchEvents") });
const Onboard = Loadable({ loader: () => import("components/Modals/Onboard") });

interface IMainRoutes {
  session: ISession;
  refetch: any;
  lang: string;
  location: any;
}

const MainRoutes: React.FC<IMainRoutes> = ({ session, refetch, lang, location }) => {
  const showFooter =
    location.pathname && location.pathname.match(/^\/inbox/) === null;
  const baseRouteProps = {
    ErrorHandler,
    ReactGA,
    session,
    refetch,
    dayjs
  };
  return (
    <div className="layout">
      <IdleTimer />
      <Navbar session={session} dayjs={dayjs} />
      <main style={{ display: "flex", flex: "3", flexDirection: "column" }}>
        <Switch>
          <Route
            onEnter={refetch}
            path="/members"
            render={() => <SearchProfiles {...baseRouteProps} />}
            exact
          />
          <Route
            path="/member/:id"
            render={(routeProps) => <ProfilePage {...routeProps} {...baseRouteProps} />}
          />
          <Route
            path="/events"
            render={() => <SearchEvents {...baseRouteProps} lang={lang} />}
            exact
          />
          <Route
            path="/event/:id"
            render={() => <EventPage {...baseRouteProps} lang={lang} />}
          />
          <Route
            path="/inbox/:chatID?"
            render={routeProps => (
              <InboxPage {...routeProps} {...baseRouteProps} lang={lang} />
            )}
          />
          <Route
            path="/settings"
            render={() => <Settings {...baseRouteProps} lang={lang} />}
          />
          <Route
            path="/get-started"
            render={() => (
              <Onboard
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                refetch={refetch}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default withAuth(session => session && session.currentuser)(MainRoutes);
