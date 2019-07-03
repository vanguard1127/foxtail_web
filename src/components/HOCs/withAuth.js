import React from "react";

import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import ReCaptcha from "../Modals/ReCaptcha";

import { GET_CURRENT_USER } from "../../queries";
const withAuth = conditionFunc => Component => props => {
  const { location } = props;
  return (
    <Query query={GET_CURRENT_USER} fetchPolicy="network-only">
      {({ data, loading, refetch }) => {
        if (loading) {
          return null;
        }

        if (data && data.currentuser.maintanence === true) {
          return (
            <section className="not-found">
              <div className="container">
                <div className="col-md-12">
                  <div className="icon">
                    <i className="nico cogs" />
                  </div>
                  <span className="head">We'll Be Right Back</span>
                  <span className="description">
                    Foxtail is currently being upgraded. Please check back soon!
                  </span>
                  <span className="description">
                    Sorry for any inconveience.
                  </span>
                  <div>
                    <span className="logo"></span>
                  </div>
                </div>
              </div>
            </section>
          );
        } else if (data && data.currentuser.captchaReq === true) {
          return <ReCaptcha />;
        }

        if (data && data.currentuser.announcement !== null) {
          if (!toast.isActive("announce")) {
            toast.info(data.currentuser.announcement, {
              position: toast.POSITION.BOTTOM_LEFT,
              autoClose: false,
              toastId: "announce"
            });
          }
        }

        if (location) {
          if (location.pathname === "/confirmation") {
            return (
              <Redirect
                to={{
                  pathname: "/",
                  state: {
                    type: "emailVer",
                    token: new URLSearchParams(location.search).get("token")
                  }
                }}
              />
            );
          } else if (location.pathname === "/phonereset") {
            return (
              <Redirect
                to={{
                  pathname: "/",
                  state: {
                    type: "phoneReset",
                    token: new URLSearchParams(location.search).get("token")
                  }
                }}
              />
            );
          }
        }

        if (conditionFunc(data)) {
          if (
            !data.currentuser.isProfileOK &&
            ~window.location.href.indexOf("/settings") === 0
          ) {
            return (
              <Redirect
                to={{
                  pathname: "/settings"
                }}
              />
            );
          } else if (location && location.pathname === "/") {
            const params = new URLSearchParams(location.search);

            const mem = params.get("mem");
            const eve = params.get("eve");
            if (mem) {
              return (
                <Redirect
                  to={{
                    pathname: "/member/" + mem
                  }}
                />
              );
            } else if (eve) {
              return (
                <Redirect
                  to={{
                    pathname: "/event/" + eve
                  }}
                />
              );
            } else {
              return (
                <Redirect
                  to={{
                    pathname: "/members"
                  }}
                />
              );
            }
          }
        }

        //TODO: See of twe need to call withAuth so much
        //console.log(":SESISN", data);
        return <Component {...props} session={data} refetch={refetch} />;
      }}
    </Query>
  );
};
export default withAuth;
