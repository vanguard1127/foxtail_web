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
  handleFBReturn = ({ password, code }, fbResetPhone) => {
    const { t, ErrorHandler, history, ReactGA, close } = this.props;
    if (!code) {
      return;
    }

    if (this.mounted) {
      this.setState(
        {
          code,
          password
        },
        () => {
          fbResetPhone()
            .then(({ data }) => {
              if (data.fbResetPhone) {
                alert(t("phoneupd"));
                ReactGA.event({
                  category: "Reset Phone",
                  action: "Success"
                });
                history.push("/members");
              } else {
                alert(t("passupfail"));
              }
              close();
            })
            .catch(res => {
              ReactGA.event({
                category: "Reset Phone",
                action: "Failuer"
              });
              ErrorHandler.catchErrors(res);
              close();
            });
        }
      );
    }
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
              onResponse={resp => {
                this.handleFBReturn(resp, fbResetPhone);
              }}
              title={t("common:updphone")}
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
