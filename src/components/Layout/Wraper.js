import React from "react";
import ReactGA from "react-ga";
import DevTools from "../../DevTools";
import NotFound from "../common/NotFound";
import { withRouter } from "react-router-dom";
import Landing from "../Landing";
import About from "../Information/About";
import FAQ from "../Information/FAQ";
import Privacy from "../Information/Privacy";
import AntiSpam from "../Information/AntiSpam";
import ToS from "../Information/ToS";
import LawEnforce from "../Information/LawEnforce";
import ReCaptcha from "../Modals/ReCaptcha";
import ShortLinkRedirect from "../Redirect/ShortLinkRedirect";
import { Body } from "./Body";
export const Wrapper = withRouter(props => {
  let location = props.location;
  if (location.pathname) {
    if (
      location.pathname === "/" &&
      (!location.search || location.search.includes("="))
    ) {
      return <Landing {...props} ReactGA={ReactGA} />;
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

    return <Body showFooter={showFooter} location={location} />;
  } else {
    return null;
  }
});
