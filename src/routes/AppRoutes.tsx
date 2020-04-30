/* eslint-disable prettier/prettier */
import React from "react";
import { Route, Switch } from "react-router-dom";

import Loadable from "components/HOCs/Loadable";
import NotFound from "components/common/NotFound";

import DevTools from "../DevTools";

import MainRoutes from "./MainRoutes";

const About = Loadable({ loader: () => import("components/Information/About") });
const FAQ = Loadable({ loader: () => import("components/Information/FAQ") });
const Privacy = Loadable({ loader: () => import("components/Information/Privacy") });
const AntiSpam = Loadable({ loader: () => import("components/Information/AntiSpam") });
const ToS = Loadable({ loader: () => import("components/Information/ToS") });
const LawEnforce = Loadable({ loader: () => import("components/Information/LawEnforce") });
const ShortLinkRedirect = Loadable({ loader: () => import("components/Redirect/ShortLinkRedirect") });
const PicsCompliance = Loadable({ loader: () => import("components/Information/PicsCompliance") });
const Landing = Loadable({ loader: () => import("containers/Landing") });

const AppRoutes: React.FC<{ lang: string }> = ({ lang }) => {
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={routeProps => {
          const { location: { search } } = routeProps;
          return search ? (
            <ShortLinkRedirect hash={search} />
          ) : !search || search.includes("=") ? (
            <Landing lang={lang} {...routeProps} />
          ) : <NotFound />;
        }}
      />
      <Route path="/tos" component={ToS} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/2257" component={PicsCompliance} />
      <Route path="/antispam" component={AntiSpam} />
      <Route path="/lawenforcement" component={LawEnforce} />
      <Route
        path="/dev"
        render={() => {
          return process.env.NODE_ENV !== "production" ? (
            <DevTools />
          ) : (
              <NotFound />
            );
        }}
      />
      <Route
        path="*"
        render={({ location }) => <MainRoutes lang={lang} location={location} />}
      />
    </Switch>
  );
};

export default AppRoutes;
