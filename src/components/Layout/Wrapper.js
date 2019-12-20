import React from "react";
import ReactGA from "react-ga";
import LoadableComponent from "../HOCs/LoadableComponent";
import DevTools from "../../DevTools";
import NotFound from "../common/NotFound";
import { withRouter } from "react-router-dom";
// const LawEnforce = LoadableComponent({
//   loader: () => import("./Body")
// });
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
export const Wrapper = withRouter(props => {
  let location = props.location;
  if (location.pathname) {
    if (
      location.pathname === "/" &&
      (!location.search || location.search.includes("="))
    ) {
      return <Landing {...props} ReactGA={ReactGA} lang={props.lang} />;
    } else if (location.pathname === "/tos") {
      return <ToS history={props.history} />;
    } else if (location.pathname === "/about") {
      return <About history={props.history} />;
    } else if (location.pathname === "/faq") {
      return <FAQ history={props.history} />;
    } else if (location.pathname === "/privacy") {
      return <Privacy history={props.history} />;
    } else if (location.pathname === "/antispam") {
      return <AntiSpam history={props.history} />;
    } else if (location.pathname === "/lawenforcement") {
      return <LawEnforce history={props.history} />;
    } else if (location.pathname === "/captcha") {
      return <ReCaptcha />;
    } else if (location.pathname === "/uh-oh") {
      return <NotFound />;
    } else if (location.pathname === "/dev") {
      if (process.env.NODE_ENV !== "production") {
        return <DevTools />;
      }
    } else if (location.pathname === "/" && location.search) {
      return <ShortLinkRedirect hash={location.search} />;
    }
    let showFooter =
      location.pathname && location.pathname.match(/^\/inbox/) === null;

    return (
      <Body
        showFooter={showFooter}
        location={location}
        dayjs={props.dayjs}
        lang={props.lang}
      />
    );
  } else {
    return null;
  }
});
