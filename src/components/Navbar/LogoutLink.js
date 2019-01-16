import React from "react";
import { ApolloConsumer } from "react-apollo";
import { withRouter } from "react-router-dom";

const handleLogout = (client, history) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.clear();
  //TODO: Causes console error but currently best options.
  client.resetStore();
  history.push("/");
};
const Logout = ({ history, t }) => (
  <ApolloConsumer>
    {client => {
      return (
        <div onClick={() => handleLogout(client, history)}>
          {t("common:Logout")}
        </div>
      );
    }}
  </ApolloConsumer>
);

export default withRouter(Logout);
