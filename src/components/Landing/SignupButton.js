import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "../common/FirebaseAuth";

class SignupButton extends PureComponent {
  fbResolve;
  state = { code: "", password: "" };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  handleFirebaseReturn = ({ code, password }) => {
    if (this.mounted) {
      const { ErrorHandler, history, ReactGA, t } = this.props;
      ErrorHandler.setBreadcrumb("Signup Button pressed");
      this.setState(
        {
          code,
          password
        },
        () => {
          this.fbResolve()
            .then(({ data }) => {
              const { isCouple } = this.props.createData;
              if (data.fbResolve === null) {
                ErrorHandler.setBreadcrumb("Signup Failed");
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

              //TODO: Consider deleting if not used
              if (isCouple) {
                ErrorHandler.setBreadcrumb("Signup OK, Couple");
                ReactGA.event({
                  category: "Signup",
                  action: "Couple"
                });
                history.push({
                  pathname: "/get-started",
                  state: { couple: true, initial: true }
                });
              } else {
                ErrorHandler.setBreadcrumb("Signup OK, Single");
                ReactGA.event({
                  category: "Signup",
                  action: "Success"
                });
                history.push({
                  pathname: "/get-started",
                  state: { initial: true }
                });
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
    const {
      disabled,
      ErrorHandler,
      validateForm,
      t,
      lang,
      createData
    } = this.props;
    const fbData = {
      ...createData,
      ...this.state,
      csrf: process.env.REACT_APP_CSRF
    };
    return (
      <Mutation mutation={FB_RESOLVE} variables={fbData}>
        {fbResolve => {
          this.fbResolve = fbResolve;
          return (
            <FirebaseAuth
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
