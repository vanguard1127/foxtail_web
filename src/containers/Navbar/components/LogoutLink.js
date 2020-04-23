import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import axios from "axios";
class Logout extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.t !== nextProps.t) {
      return true;
    }
    return false;
  }
  handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token)
      axios.get(process.env.REACT_APP_HTTPS_URL + "/offline?token=" + token);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    //TODO:Causes console error but currently best option.
    this.props.client.resetStore();
    window.location.reload(false);
    this.props.history.push("/", { noCheck: true });
  };

  render() {
    const { t } = this.props;
    return <div onClick={this.handleLogout}>{t("common:Logout")}</div>;
  }
}
export default withRouter(withApollo(Logout));
