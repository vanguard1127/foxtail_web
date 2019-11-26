import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "../common/FirebaseAuth";

class SignupButton extends PureComponent {
  fbResolve;
  state = { csrf: "", code: "", password: "" };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleFirebaseReturn = ({ state, code, password }) => {
    if (this.mounted) {
      const { ErrorHandler, history, ReactGA, t } = this.props;
      this.setState(
        {
          csrf: state,
          code,
          password
        },
        () => {
          this.fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.state;
              if (data.fbResolve === null) {
                ReactGA.event({
                  category: "Signup",
                  action: "Fail"
                });
                const failmsg = t("Signup failed.");
                alert(failmsg);
                return;
              }

              localStorage.setItem(
                "token",
                data.fbResolve.find(token => token.access === "auth").token
              );
              localStorage.setItem(
                "refreshToken",
                data.fbResolve.find(token => token.access === "refresh").token
              );

              if (isCouple) {
                ReactGA.event({
                  category: "Signup",
                  action: "Couple"
                });
                history.push({
                  pathname: "/settings",
                  state: { couple: true, initial: true }
                });
              } else {
                ReactGA.event({
                  category: "Signup",
                  action: "Success"
                });
                history.push({
                  pathname: "/settings",
                  state: { initial: true }
                });
              }
            })
            .catch(res => {
              ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };

  render() {
    const {
      disabled,
      ErrorHandler,
      validateForm,
      t,
      lang,
      createData
    } = this.props;
    const fbData = { ...createData, ...this.state };
    return (
      <Mutation mutation={FB_RESOLVE} variables={fbData}>
        {fbResolve => {
          this.fbResolve = fbResolve;
          return (
            <FirebaseAuth
              csrf={"889306f7553962e44db6ed508b4e8266"}
              language={lang}
              validateForm={validateForm}
              disabled={disabled}
              ErrorHandler={ErrorHandler}
              onResponse={this.handleFirebaseReturn}
              type="signup"
              title={t("pleasever")}
            >
              <div className="submit">
                <button className="btn">{t("getstarted")}</button>
              </div>
            </FirebaseAuth>
          );
        }}
      </Mutation>
    );
  }
}

export default SignupButton;
