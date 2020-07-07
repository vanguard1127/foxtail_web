import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withApollo } from "react-apollo";
import axios from "axios";

interface ILogoutProps extends RouteComponentProps {
  t: any;
  client: any;
}

const Logout: React.FC<ILogoutProps> = ({ t, client, history }) => {
  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(process.env.REACT_APP_HTTPS_URL + "/offline?token=" + token);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();
    client.resetStore();
    history.push("/", { noCheck: true });
  };

  return <div onClick={handleLogout}>{t("common:Logout")}</div>;

}
export default withRouter(withApollo(Logout));
