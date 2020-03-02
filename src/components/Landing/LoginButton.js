import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import FirebaseAuth from "../common/FirebaseAuth";
import { toast } from "react-toastify";

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
    toast.dismiss();
  }

  handleFirebaseReturn = ({ code, password }, fbResolve) => {
    if (this.mounted) {
      const { reactga, t, ErrorHandler, toast } = this.props;

      toast("Logging in...", { toastId: "loginPop", hideProgressBar: false });
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
                  action: "No user"
                });

                toast.dismiss("loginPop");
                alert(t("noUserError") + ".");
                window.location.reload();
                return;
              } else if (data.fbResolve.length === 0) {
                reactga.event({
                  category: "Login",
                  action: "Fail"
                });

                toast.dismiss("loginPop");
                alert(
                  t(
                    "Invalid Login - Please contact us at support@foxtailapp.com if you are having problems logging in."
                  )
                );
                window.location.reload();
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
              toast.dismiss("loginPop");
              ErrorHandler.catchErrors(res);
              alert(t("common:error"));
              window.location.reload();
            });
        }
      );
    }
  };

  render() {
    const { code, password } = this.state;
    const {
      t,
      lang,
      ErrorHandler,
      toggleResetPhone,
      toggleResetPass
    } = this.props;
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
              t={t}
              toggleResetPhone={toggleResetPhone}
              toggleResetPass={toggleResetPass}
            >
              <a className="login-btn" id="login-btn">
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
