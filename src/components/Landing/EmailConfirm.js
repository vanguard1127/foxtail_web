import React from "react";
import { Redirect } from "react-router-dom";
const EmailConfirm = props => {
  return (
    <Redirect
      to={{
        pathname: "/",
        state: { type: "emailVer", token: props.match.params.token }
      }}
    />
  );
};

export default EmailConfirm;
