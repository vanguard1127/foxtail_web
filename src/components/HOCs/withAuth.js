import React from "react";

import { Query } from "react-apollo";

import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { GET_CURRENT_USER } from "../../queries";
const withAuth = conditionFunc => Component => props => {
  if (localStorage.getItem("token") === null) {
    window.location.replace(
      process.env.NODE_ENV === "production"
        ? "https://foxtailapp.com/"
        : "http://localhost:3000/"
    );
    return null;
  } else {
    return (
      <Query query={GET_CURRENT_USER}>
        {({ data, loading, refetch }) => {
          if (loading) {
            return null;
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
            }

            return <Component {...props} session={data} refetch={refetch} />;
          } else {
            return <Redirect to="/" />;
          }
        }}
      </Query>
    );
  }
};

export default withAuth;
