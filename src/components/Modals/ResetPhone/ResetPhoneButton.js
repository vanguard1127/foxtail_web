import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESET_PHONE } from "../../../queries";
import AccountKit from "react-facebook-account-kit";

const initialState = {
  csrf: "",
  code: ""
};
class ResetPhoneButton extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleFBReturn = ({ state, code }, fbResetPhone) => {
    const { t, ErrorHandler, history } = this.props;
    if (!state || !code) {
      return;
    }
    if (this.mounted) {
      this.setState({
        csrf: state,
        code
      });
    }
    fbResetPhone()
      .then(async ({ data }) => {
        if (data.fbResetPhone === null) {
          alert(t("noUserError") + ".");
          return;
        } else {
          alert(t("phoneupd"));
          localStorage.setItem(
            "token",
            data.fbResetPhone.find(token => token.access === "auth").token
          );
          localStorage.setItem(
            "refreshToken",
            data.fbResetPhone.find(token => token.access === "refresh").token
          );
          history.push("/members");
        }
      })
      .catch(res => {
        ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };
  render() {
    const { csrf, code, lang } = this.state;
    const { t, token } = this.props;
    return (
      <Mutation mutation={FB_RESET_PHONE} variables={{ csrf, code, token }}>
        {fbResetPhone => {
          return (
            <AccountKit
              appId="172075056973555" // Update this!
              version="v1.1" // Version must be in form v{major}.{minor}
              onResponse={resp => {
                this.handleFBReturn(resp, fbResetPhone);
              }}
              csrf={"889306f7553962e44db6ed508b4e8266"} // Required for security
              countryCode={"+1"} // eg. +60
              phoneNumber={""} // eg. 12345678
              emailAddress={"noreply@foxtailapp.com"} // eg. me@site.com
              language={lang}
            >
              {p => (
                <span className="color" {...p}>
                  {t("updatedphone")}
                </span>
              )}
            </AccountKit>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPhoneButton;
