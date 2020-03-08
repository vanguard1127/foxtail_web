import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESET_PHONE } from "../../../queries";
import FirebaseAuth from "../../common/FirebaseAuth";

const initialState = {
  code: "",
  password: ""
};
class ResetPhoneButton extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  success = data => {
    const { history, t, ReactGA } = this.props;
    if (!data.fbResolve || data.fbResolve.length === 0) {
      ReactGA.event({
        category: "Reset Phone",
        action: "Fail"
      });
      alert(t("passupfail"));
      return;
    }
    alert(t("phoneupd"));
    ReactGA.event({
      category: "Reset Phone",
      action: "Success"
    });
    history.push("/members");
  };

  fail = err => {
    const { ReactGA, ErrorHandler, close } = this.props;
    ReactGA.event({
      category: "Reset Phone",
      action: "Failure"
    });
    ErrorHandler.catchErrors(err);
    close();
  };

  render() {
    const { code, lang, password } = this.state;
    const { t, token, ErrorHandler } = this.props;

    return (
      <Mutation
        mutation={FB_RESET_PHONE}
        variables={{ csrf: process.env.REACT_APP_CSRF, code, token, password }}
      >
        {fbResetPhone => {
          return (
            <FirebaseAuth
              language={lang}
              ErrorHandler={ErrorHandler}
              t={t}
              title={t("common:updphone")}
              success={this.success}
              fail={this.fail}
            >
              <span className="color">{t("common:update")}</span>
            </FirebaseAuth>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPhoneButton;
