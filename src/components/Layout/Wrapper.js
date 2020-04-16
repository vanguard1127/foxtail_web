import React from "react";
import { Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";

import LoadableComponent from "../HOCs/LoadableComponent";

import DevTools from "../../DevTools";
import NotFound from "../common/NotFound";
import { Body } from "./Body";
import Landing from "../Landing/";

const About = LoadableComponent({
  loader: () => import("../Information/About")
});
const FAQ = LoadableComponent({
  loader: () => import("../Information/FAQ")
});
const Privacy = LoadableComponent({
  loader: () => import("../Information/Privacy")
});
const AntiSpam = LoadableComponent({
  loader: () => import("../Information/AntiSpam")
});
const ToS = LoadableComponent({
  loader: () => import("../Information/ToS")
});
const LawEnforce = LoadableComponent({
  loader: () => import("../Information/LawEnforce")
});
const ReCaptcha = LoadableComponent({
  loader: () => import("../Modals/ReCaptcha")
});
const ShortLinkRedirect = LoadableComponent({
  loader: () => import("../Redirect/ShortLinkRedirect")
});
const PicsCompliance = LoadableComponent({
  loader: () => import("../Information/PicsCompliance")
});

const MainRoutes = ({ lang }) => {
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={routeProps => {
          const {
            location: { search }
          } = routeProps;
          return search ? (
            <ShortLinkRedirect hash={search} />
          ) : !search || search.includes("=") ? (
            <Landing ReactGA={ReactGA} lang={lang} {...routeProps} />
          ) : (
            <NotFound />
          );
        }}
      />
      <Route path="/tos" component={ToS} />
      <Route path="/about" component={About} />
      <Route path="/faq" component={FAQ} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/2257" component={PicsCompliance} />
      <Route path="/antispam" component={AntiSpam} />
      <Route path="/lawenforcement" component={LawEnforce} />
      <Route path="/captcha" component={ReCaptcha} />
      <Route path="/uh-oh" component={NotFound} />
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
        render={({ location }) => <Body lang={lang} location={location} />}
      />
    </Switch>
  );
};

export default MainRoutes;
