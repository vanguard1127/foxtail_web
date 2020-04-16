/* eslint-disable prettier/prettier */
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ReactGA from "react-ga";
import dayjs from "dayjs";

import Loadable from "../components/HOCs/Loadable";
import * as ErrorHandler from "../components/common/ErrorHandler";
import withAuth from "../components/HOCs/withAuth";
import IdleTimer from "../components/HOCs/IdleTimer";

import Navbar from "../components/Navbar";

import "../components/Header/header.css";

const ProfileSearch = Loadable({ loader: () => import("../components/SearchProfiles") });
const Footer = Loadable({ loader: () => import("../components/Footer") });
const Settings = Loadable({ loader: () => import("../components/Settings") });
const EventPage = Loadable({ loader: () => import("../components/Event") });
const ProfilePage = Loadable({ loader: () => import("../components/Profile") });
const InboxPage = Loadable({ loader: () => import("../components/Inbox") });
const SearchEvents = Loadable({ loader: () => import("../components/SearchEvents") });
const Onboard = Loadable({ loader: () => import("../components/Modals/Onboard") });

const MainRoutes = ({ session, refetch, lang, location }) => {
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
      <header className="topbar">
        <Navbar ErrorHandler={ErrorHandler} session={session} dayjs={dayjs} />
      </header>
      <main style={{ display: "flex", flex: "3", flexDirection: "column" }}>
        <Switch>
          <Route
            onEnter={refetch}
            path="/members"
            render={() => <ProfileSearch {...baseRouteProps} />}
            exact
          />
          <Route
            path="/member/:id"
            render={() => <ProfilePage {...baseRouteProps} />}
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
