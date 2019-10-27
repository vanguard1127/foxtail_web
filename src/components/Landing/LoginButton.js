import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "./FirebaseAuth";
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

  handleFirebaseReturn = ({ state, code }, fbResolve) => {
    if (this.mounted) {
      const { ErrorHandler, history, ReactGA } = this.props;
      this.setState(
        {
          csrf: state,
          code
        },
        () => {
          fbResolve()
            .then(async ({ data }) => {
              if (data.fbResolve === null) {
                ReactGA.event({
                  category: "Login",
                  action: "Fail"
                });
                alert(t("noUserError") + ".");

                return;
              } else {
                ReactGA.event({
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
  handleFBReturn = ({ state, code }, fbResolve) => {
    if (this.mounted) {
      if (!state || !code) {
        return null;
      }
      const { t, ReactGA } = this.props;

      this.setState({
        csrf: state,
        code
      });

      fbResolve()
        .then(async ({ data }) => {
          if (data.fbResolve === null) {
            ReactGA.event({
              category: "Login",
              action: "Fail"
            });
            alert(t("noUserError") + ".");

            return;
          } else {
            ReactGA.event({
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
  };
  render() {
    const { csrf, code } = this.state;
    const { t, lang, ErrorHandler } = this.props;
    const props = this.props;

    return (
      <Mutation
        mutation={FB_RESOLVE}
        variables={{ csrf, code, isCreate: false }}
      >
        {fbResolve => {
          return (
            <FirebaseAuth
              csrf={"889306f7553962e44db6ed508b4e8266"}
              phoneNumber={""} // eg. 12345678
              language={lang}
              ErrorHandler={ErrorHandler}
              onResponse={this.handleFirebaseReturn}
              fbResolve={fbResolve}
            >
              <a {...props} className="login-btn">
                {t("loginBtn")}
              </a>
            </FirebaseAuth>
          );
        }}
      </Mutation>
    );
  }
}

export default LoginButton;
