import React, { PureComponent } from "react";
import FirebaseAuth from "../common/FirebaseAuth";
import { toast } from "react-toastify";

class LoginButton extends PureComponent {
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    toast.dismiss();
  }
  loadingToast = () => {
    toast("Logging in...", { toastId: "loginPop", hideProgressBar: false });
  };
  success = data => {
    const { history, t, reactga } = this.props;
    if (!data.fbResolve || data.fbResolve.length === 0) {
      reactga.event({
        category: "Login",
        action: "Fail"
      });

      toast.dismiss("loginPop");
      alert(
        t(
          "Invalid Login - Please check your password and try again. Contact us at support@foxtailapp.com if you are having problems logging in."
        )
      );
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
      history.push("/members");
    }
  };
  fail = err => {
    toast.dismiss("loginPop");
    this.props.ErrorHandler.catchErrors(err);
    alert(this.props.t("common:error"));
    window.location.reload();
  };
  render() {
    const {
      t,
      lang,
      ErrorHandler,
      toggleResetPhone,
      toggleResetPass
    } = this.props;
    return (
      <FirebaseAuth
        language={lang}
        ErrorHandler={ErrorHandler}
        title={t("welcomeback")}
        t={t}
        toggleResetPhone={toggleResetPhone}
        toggleResetPass={toggleResetPass}
        loadingCB={this.loadingToast}
        success={this.success}
        fail={this.fail}
      >
        <a className="login-btn" id="login-btn">
          {t("loginBtn")}
        </a>
      </FirebaseAuth>
    );
  }
}

export default LoginButton;
