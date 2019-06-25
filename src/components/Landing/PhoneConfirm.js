import React from "react";
import { Redirect } from "react-router-dom";
const PhoneConfirm = props => {
  return (
    <Redirect
      to={{
        pathname: "/",
        state: { type: "phoneReset", token: props.match.params.token }
      }}
    />
  );
};

export default PhoneConfirm;
