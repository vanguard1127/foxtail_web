import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { FB_RESET_PHONE } from "../../../queries";
import FirebaseAuth from "../../common/FirebaseAuth";

const initialState = {
  code: "",
  password: "",
  phone: ""
};

class ChangePhoneBtn extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  success = data => {
    const { t, ReactGA } = this.props;
    if (!data.fbResolve || data.fbResolve.length === 0) {
      alert(t("common:tryagain"));
      return;
    }
    ReactGA.event({
      category: "Settings",
      action: "Change Phone"
    });
    toast.success(t("changenum"));
  };

  fail = err => {
    this.props.ErrorHandler.catchErrors(err);
  };

  render() {
    const { code, password } = this.state;
    const { t, lang, ErrorHandler } = this.props;
    return (
      <Mutation
        mutation={FB_RESET_PHONE}
        variables={{ csrf: process.env.REACT_APP_CSRF, code, password }}
      >
        {fbResetPhone => {
          return (
            <FirebaseAuth
              language={lang}
              t={t}
              ErrorHandler={ErrorHandler}
              title={t("common:updphone")}
              success={this.success}
              fail={this.fail}
            >
              <div className="verification-box">
                <span className="clickverify-btn">{t("updatephone")}</span>
              </div>
            </FirebaseAuth>
          );
        }}
      </Mutation>
    );
  }
}

export default ChangePhoneBtn;
