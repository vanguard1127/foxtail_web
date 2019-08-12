import React, { Component } from "react";
import { withApollo } from "react-apollo";
import axios from "axios";
class Logout extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  handleLogout = () => {
    axios.get(
      process.env.NODE_ENV === "production"
        ? "https://prod.foxtailapi.com/offline?token=" +
            localStorage.getItem("token")
        : "http://localhost:4444/offline?token=" + localStorage.getItem("token")
    );
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    //Causes console error but currently best option.
    this.props.client.resetStore();

    window.location.replace("/");
  };

  render() {
    const { t } = this.props;
    return <div onClick={this.handleLogout}>{t("common:Logout")}</div>;
  }
}
export default withApollo(Logout);
