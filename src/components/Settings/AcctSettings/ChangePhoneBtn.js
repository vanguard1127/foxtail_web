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

  handleFBReturn = ({ code, password }, fbResetPhone) => {
    if (!code) {
      return;
    }

    const { t, ReactGA } = this.props;
    if (this.mounted) {
      this.setState(
        {
          code,
          password
        },
        () => {
          fbResetPhone()
            .then(({ data }) => {
              if (data.fbResetPhone === null) {
                alert(t("common:tryagain"));
                return;
              } else if (data.fbResetPhone === false) {
                alert(t("common:Incorrect information, please try again."));
                window.location.reload();
                return;
              }
              ReactGA.event({
                category: "Settings",
                action: "Change Phone"
              });
              toast.success(t("changenum"));
            })
            .catch(res => {
              this.props.ErrorHandler.catchErrors(res);
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
        mutation={FB_RESET_PHONE}
        variables={{ csrf: process.env.REACT_APP_CSRF, code, password }}
      >
        {fbResetPhone => {
          return (
            <FirebaseAuth
              language={lang}
              t={t}
              ErrorHandler={ErrorHandler}
              onResponse={resp => this.handleFBReturn(resp, fbResetPhone)}
              title={t("common:updphone")}
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
