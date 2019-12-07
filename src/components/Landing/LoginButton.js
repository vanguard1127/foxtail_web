import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "../common/FirebaseAuth";

const initialState = {
  code: "",
  password: ""
};
class LoginButton extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleFirebaseReturn = ({ code, password }, fbResolve) => {
    if (this.mounted) {
      const { reactga, t, ErrorHandler } = this.props;
      console.log("FFRR", code, password);
      this.setState(
        {
          code,
          password
        },
        () => {
          fbResolve()
            .then(async ({ data }) => {
              if (data.fbResolve === null) {
                reactga.event({
                  category: "Login",
                  action: "Fail"
                });
                alert(t("noUserError") + ".");

                return;
              } else {
                reactga.event({
                  category: "Login",
                  action: "Success"
                });
                localStorage.setItem(
                  "token",
                  data.fbResolve.find(token => token.access === "auth").token
                );
                localStorage.setItem(
                  "refreshToken",
                  data.fbResolve.find(token => token.access === "refresh").token
                );
                this.props.history.push("/members");
              }
            })
            .catch(res => {
              ErrorHandler.catchErrors(res);
            });
        }
      );
    }
  };

  render() {
    const { code, password } = this.state;
    const { t, lang, ErrorHandler } = this.props;
    return (
      <Mutation
        mutation={FB_RESOLVE}
        variables={{
          csrf: process.env.REACT_APP_CSRF,
          code,
          isCreate: false,
          password
        }}
      >
        {fbResolve => {
          return (
            <FirebaseAuth
              language={lang}
              ErrorHandler={ErrorHandler}
              onResponse={resp => this.handleFirebaseReturn(resp, fbResolve)}
              title={t("welcomeback")}
            >
              <a className="login-btn">{t("loginBtn")}</a>
            </FirebaseAuth>
          );
        }}
      </Mutation>
    );
  }
}

export default LoginButton;
