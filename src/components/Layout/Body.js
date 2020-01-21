import Navbar from "../Navbar/";
import React from "react";
import ReactGA from "react-ga";
import LoadableComponent from "../HOCs/LoadableComponent";
import * as ErrorHandler from "../common/ErrorHandler";
import { Route, Switch, Redirect } from "react-router-dom";
import withAuth from "../HOCs/withAuth";
import IdleTimer from "../HOCs/IdleTimer";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
const ProfileSearch = LoadableComponent({
  loader: () => import("../SearchProfiles/")
});
const Footer = LoadableComponent({
  loader: () => import("../Footer/")
});
const Settings = LoadableComponent({
  loader: () => import("../Settings/")
});
const EventPage = LoadableComponent({
  loader: () => import("../Event/")
});
const ProfilePage = LoadableComponent({
  loader: () => import("../Profile/")
});
const InboxPage = LoadableComponent({
  loader: () => import("../Inbox/")
});
const SearchEvents = LoadableComponent({
  loader: () => import("../SearchEvents/")
});

export const Body = withAuth(session => session && session.currentuser)(
  ({ showFooter, session, refetch, lang }) => (
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
            render={() => (
              <ProfileSearch
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
              />
            )}
            exact
          />
          <Route
            path="/events"
            render={() => (
              <SearchEvents
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
                lang={lang}
              />
            )}
            exact
          />
          <Route
            path="/event/:id"
            render={() => (
              <EventPage
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
                lang={lang}
              />
            )}
          />
          <Route
            path="/member/:id"
            render={() => (
              <ProfilePage
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
              />
            )}
          />
          <Route
            path="/inbox/:chatID"
            render={routeProps => (
              <InboxPage
                {...routeProps}
                ReactGA={ReactGA}
                ErrorHandler={ErrorHandler}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
                lang={lang}
              />
            )}
          />
          <Route
            path="/inbox"
            render={routeProps => (
              <InboxPage
                {...routeProps}
                ReactGA={ReactGA}
                ErrorHandler={ErrorHandler}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
                lang={lang}
              />
            )}
          />
          <Route
            path="/settings"
            render={() => (
              <Settings
                ErrorHandler={ErrorHandler}
                ReactGA={ReactGA}
                session={session}
                refetch={refetch}
                dayjs={dayjs}
                lang={lang}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </main>
      {showFooter && <Footer />}
      <ToastContainer position="top-center" hideProgressBar={true} />
    </div>
  )
);
