import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "../common/FirebaseAuth";

const initialState = {
  csrf: "",
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

  handleFirebaseReturn = ({ state, code, password }, fbResolve) => {
    if (this.mounted) {
      const { reactga } = this.props;
      this.setState(
        {
          csrf: state,
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
              this.props.ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  render() {
    const { csrf, code, password } = this.state;
    const { t, lang, errorhandler } = this.props;
    return (
      <Mutation
        mutation={FB_RESOLVE}
        variables={{ csrf, code, isCreate: false, password }}
      >
        {fbResolve => {
          return (
            <FirebaseAuth
              csrf={"889306f7553962e44db6ed508b4e8266"}
              phoneNumber={""} // eg. 12345678
              language={lang}
              ErrorHandler={errorhandler}
              onResponse={this.handleFirebaseReturn}
              fbResolve={fbResolve}
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
