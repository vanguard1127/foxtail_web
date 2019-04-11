import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";

const initialState = {
  csrf: "",
  code: ""
};
class LoginButton extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleFBReturn = ({ state, code }, fbResolve) => {
    console.log("Login opened");
    if (this.mounted) {
      if (!state || !code) {
        return null;
      }
      const { t } = this.props;

      this.setState({
        csrf: state,
        code
      });

      fbResolve()
        .then(async ({ data }) => {
          if (data.fbResolve === null) {
            alert(t("noUserError") + ".");
            return;
          } else {
            localStorage.setItem(
              "token",
              data.fbResolve.find(token => token.access === "auth").token
            );
            localStorage.setItem(
              "refreshToken",
              data.fbResolve.find(token => token.access === "refresh").token
            );
            //  await this.props.refetch();
            this.props.history.push("/members");
          }
        })
        .catch(res => {
          //TODO: Add error setter here
          const errors = res.graphQLErrors.map(error => {
            return error.message;
          });
          this.setState({ errors });
        });
    }
  };
  render() {
    const { csrf, code } = this.state;
    const { t } = this.props;

    return (
      <Mutation
        mutation={FB_RESOLVE}
        variables={{ csrf, code, isCreate: false }}
      >
        {fbResolve => {
          return (
            <AccountKit
              appId="172075056973555" // Update this!
              version="v1.1" // Version must be in form v{major}.{minor}
              onResponse={resp => {
                this.handleFBReturn(resp, fbResolve);
              }}
              csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
              countryCode={"+1"} // eg. +60
              phoneNumber={""} // eg. 12345678
              emailAddress={"noreply@foxtailapp.com"} // eg. me@site.com
              language={localStorage.getItem("i18nextLng")}
            >
              {p => (
                <a {...p} className="login-btn">
                  {t("loginBtn")}
                </a>
              )}
            </AccountKit>
          );
        }}
      </Mutation>
    );
  }
}

export default LoginButton;
