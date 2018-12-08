import React from "react";
import { ApolloConsumer } from "react-apollo";
import { withRouter } from "react-router-dom";
import { Button } from "antd";

const handleSignout = (client, history) => {
  //TODO: Prevent console error on logout
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  client.resetStore();
  history.push("/");
};
const Signout = ({ history }) => (
  <ApolloConsumer>
    {client => {
      return (
        <Button onClick={() => handleSignout(client, history)}>Signout</Button>
      );
    }}
  </ApolloConsumer>
);

export default withRouter(Signout);
