import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { LOGIN, FB_RESOLVE } from "../../queries";
import AccountKit from "react-facebook-account-kit";

const initialState = {
  csrf: "",
  code: "",
  phone: ""
};
class LoginButton extends Component {
  state = { ...initialState };
  handleFBReturn = ({ state, code }, fbResolve, login) => {
    this.setState({
      csrf: state,
      code
    });
    fbResolve()
      .then(({ data }) => {
        if (data.fbResolve === null) {
          alert("Login failed.");
          return;
        }
        this.setState({ phone: data.fbResolve });
        login()
          .then(async ({ data }) => {
            if (data.login === null) {
              alert("User doesn't exist.");
              return;
            }

            localStorage.setItem(
              "token",
              data.login.find(token => token.access === "auth").token
            );
            localStorage.setItem(
              "refreshToken",
              data.login.find(token => token.access === "refresh").token
            );
            await this.props.refetch();
            this.props.history.push("/members");
          })
          .catch(res => {
            const errors = res.graphQLErrors.map(error => {
              return error.message;
            });

            //TODO: send errors to analytics from here
            this.setState({ errors });
          });
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        this.setState({ errors });
      });
  };
  render() {
    const { csrf, code, phone } = this.state;
    return (
      <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
        {fbResolve => {
          return (
            <Mutation mutation={LOGIN} variables={{ phone }}>
              {(login, { loading, error }) => {
                return (
                  <AccountKit
                    appId="172075056973555" // Update this!
                    version="v1.1" // Version must be in form v{major}.{minor}
                    onResponse={resp => {
                      this.handleFBReturn(resp, fbResolve, login);
                    }}
                    csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
                    countryCode={"+1"} // eg. +60
                    phoneNumber={""} // eg. 12345678
                    emailAddress={"noreply@foxtailapp.com"} // eg. me@site.com
                  >
                    {p => (
                      <a {...p} className="login-btn">
                        Already member? Login
                      </a>
                    )}
                  </AccountKit>
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default LoginButton;
