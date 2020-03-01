import React from "react";

import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import ReCaptcha from "../Modals/ReCaptcha";
import i18next from "i18next";
import dayjs from "dayjs";

import { ApolloConsumer } from "react-apollo";
import { GET_CURRENT_USER, CONFIRM_EMAIL } from "../../queries";

const withAuth = conditionFunc => Component => props => {
  const { location } = props;
  return (
    <ApolloConsumer>
      {client => {
        return (
          <Query
            query={GET_CURRENT_USER}
            variables={{
              isMobile: sessionStorage.getItem("isMobile")
            }}
            fetchPolicy="cache-first"
          >
            {({ data, loading, refetch, error }) => {
              if (loading) {
                return null;
              }

              if (location) {
                if (location.pathname === "/confirmation") {
                  client
                    .query({
                      query: CONFIRM_EMAIL,
                      variables: {
                        token: new URLSearchParams(location.search).get("token")
                      }
                    })
                    .then(resp => {
                      if (resp.data.confirmEmail) {
                        if (!toast.isActive("emailVer")) {
                          toast.success(
                            i18next.t("common:Email has been confirmed."),
                            {
                              position: toast.POSITION.TOP_CENTER,
                              toastId: "emailVer"
                            }
                          );
                        }
                      } else {
                        if (!toast.isActive("errVer")) {
                          toast.error(
                            i18next.t(
                              "common:Email confirmation has been used or is expired, please go to your 'My Account' page to request another."
                            ),
                            {
                              position: toast.POSITION.TOP_CENTER,
                              toastId: "errVer",
                              autoClose: 8000
                            }
                          );
                        }
                      }
                    });
                } else if (location.pathname === "/phonereset") {
                  const token = new URLSearchParams(location.search).get(
                    "token"
                  );

                  if (token) {
                    return (
                      <Redirect
                        to={{
                          pathname: "/",
                          state: {
                            type: "phoneReset",
                            token
                          }
                        }}
                        push={true}
                      />
                    );
                  } else {
                    if (!toast.isActive("errVer")) {
                      toast.error(i18next.t("phonefail"), {
                        position: toast.POSITION.TOP_CENTER,
                        toastId: "errVer"
                      });
                    }
                  }
                } else if (location.pathname === "/passReset") {
                  const token = new URLSearchParams(location.search).get(
                    "token"
                  );
                  if (token) {
                    return (
                      <Redirect
                        to={{
                          pathname: "/",
                          state: {
                            type: "passReset",
                            token
                          }
                        }}
                        push={true}
                      />
                    );
                  } else {
                    if (!toast.isActive("errVer")) {
                      toast.error(i18next.t("passfail"), {
                        position: toast.POSITION.TOP_CENTER,
                        toastId: "errVer"
                      });
                    }
                  }
                }
              }

              if (error) {
                if (location.pathname === "/" && location.search) {
                  return <Component {...props} />;
                }
                if (location.state) {
                  if (
                    location.state.noCheck ||
                    (location.state.token &&
                      location.state.type === "passReset") ||
                    (location.state.token &&
                      location.state.type === "phoneReset")
                  ) {
                    return <Component {...props} />;
                  }
                }

                return (
                  <Redirect
                    to={{
                      pathname: "/",
                      state: {
                        noCheck: true
                      }
                    }}
                  />
                );
              }

              if (data && data.currentuser) {
                if (data.currentuser.captchaReq === true) {
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
                if (conditionFunc(data)) {
                  const yesterday = dayjs().subtract(1, "day");
                  const createdAt = dayjs(data.currentuser.createdAt);
                  const isPreview = createdAt.isAfter(yesterday);
                  if (
                    !isPreview &&
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
              }

              return <Component {...props} session={data} refetch={refetch} />;
            }}
          </Query>
        );
      }}
    </ApolloConsumer>
  );
};
export default withAuth;
