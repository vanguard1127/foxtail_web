import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import { withRouter } from "react-router-dom";
import axios from "axios";
class Logout extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  handleLogout = (client, history) => {
    axios.get(
      process.env.NODE_ENV === "production"
        ? "https://prod.foxtailapi.com/offline?token=" +
            localStorage.getItem("token")
        : "http://localhost:4444/offline?token=" + localStorage.getItem("token")
    );
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    // delete window.AccountKit;

    //Causes console error but currently best option.
    client.resetStore();
    history.push("/");
  };

  render() {
    const { history, t } = this.props;
    return (
      <ApolloConsumer>
        {client => {
          return (
            <div onClick={() => this.handleLogout(client, history)}>
              {t("common:Logout")}
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}
export default withRouter(Logout);
