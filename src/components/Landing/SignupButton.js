import React, { PureComponent } from "react";
import FirebaseAuth from "../common/FirebaseAuth";

class SignupButton extends PureComponent {
  state = { code: "", password: "" };

  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  success = data => {
    const { history, t, ReactGA, ErrorHandler } = this.props;
    if (!data.fbResolve || data.fbResolve.length === 0) {
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

    ErrorHandler.setBreadcrumb("Signup OK, Single");
    ReactGA.event({
      category: "Signup",
      action: "Success"
    });
    history.push({
      pathname: "/get-started",
      state: { initial: true }
    });
  };

  fail = err => {
    this.props.ErrorHandler.catchErrors(err);
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

    return (
      <FirebaseAuth
        language={lang}
        validateForm={validateForm}
        disabled={disabled}
        ErrorHandler={ErrorHandler}
        type="signup"
        createData={{
          ...createData,
          ...this.state,
          csrf: process.env.REACT_APP_CSRF
        }}
        t={t}
        title={t("pleasever")}
        success={this.success}
        fail={this.fail}
      >
        <div className="submit">
          <button className="btn">{t("getstarted")}</button>
        </div>
      </FirebaseAuth>
    );
  }
}

export default SignupButton;
