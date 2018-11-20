import React from "react";

import { Query } from "react-apollo";

import { Redirect } from "react-router-dom";

import { GET_CURRENT_USER } from "../queries";
const withAuth = conditionFunc => Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({ data, loading, refetch }) => {
      if (loading) {
        return null;
      }

      if (conditionFunc(data)) {
        this.isProfileOK = data.currentuser.isProfileOK;
        if (
          !data.currentuser.isProfileOK &&
          ~window.location.href.indexOf("/editprofile") === 0
        ) {
          return (
            <Redirect
              to={{
                pathname: "/editprofile",
                state: { alert: "Please complete your profile" }
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

export default withAuth;
