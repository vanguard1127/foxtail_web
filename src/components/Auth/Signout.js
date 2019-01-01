import React from "react";
import { ApolloConsumer } from "react-apollo";
import { withRouter } from "react-router-dom";

const handleSignout = (client, history) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  //TODO: Causes console error but currently best options.
  client.resetStore();
  history.push("/");
};
const Signout = ({ history }) => (
  <ApolloConsumer>
    {client => {
      return <div onClick={() => handleSignout(client, history)}>Signout</div>;
    }}
  </ApolloConsumer>
);

export default withRouter(Signout);
