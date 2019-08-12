import React from "react";

import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import ReCaptcha from "../Modals/ReCaptcha";
import Spinner from "../common/Spinner";

import { GET_CURRENT_USER } from "../../queries";
const withAuth = conditionFunc => Component => props => {
  const { location, t } = props;

  return (
    //TODO: See when cache-first works and add here
    <Query query={GET_CURRENT_USER} fetchPolicy="network-only">
      {({ data, loading, refetch }) => {
        if (loading) {
          return <Spinner size="large" />;
        }

        if (data) {
          if (data.currentuser === undefined || data.currentuser === null) {
            return <Spinner size="large" />;
          } else if (data.currentuser.maintanence === true) {
            return (
              <section className="not-found">
                <div className="container">
                  <div className="col-md-12">
                    <div className="icon">
                      <i className="nico cogs" />
                    </div>
                    <span className="head">{t("We'll Be Right Back")}</span>
                    <span className="description">
                      {t(
                        "Foxtail is currently being upgraded. Please check back soon!"
                      )}
                    </span>
                    <span className="description">
                      {t("Sorry for any inconveience.")}
                    </span>
                    <div>
                      <span className="logo"></span>
                    </div>
                  </div>
                </div>
              </section>
            );
          } else if (data.currentuser.captchaReq === true) {
            return <ReCaptcha />;
          }

          //SHOW ANNOUNCE ON LOGIN
          if (data.currentuser.announcement !== null) {
            if (!toast.isActive("announce")) {
              toast.info(data.currentuser.announcement, {
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose: false,
                toastId: "announce"
              });
            }
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
