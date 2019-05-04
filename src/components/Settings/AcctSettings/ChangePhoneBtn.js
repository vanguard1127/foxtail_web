import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { FB_RESET_PHONE } from "../../../queries";
import AccountKit from "react-facebook-account-kit";

const initialState = {
  csrf: "",
  code: "",
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

  handleFBReturn = ({ state, code }, fbResetPhone) => {
    if (!state || !code) {
      return;
    }
    const { t } = this.props;
    if (this.mounted) {
      this.setState({
        csrf: state,
        code
      });
    }
    fbResetPhone()
      .then(({ data }) => {
        if (data.fbResetPhone === null) {
          alert(t("common:tryagain"));
          return;
        }
        toast.success(t("changenum"));
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { csrf, code } = this.state;
    const { t, lang } = this.props;
    return (
      <Mutation mutation={FB_RESET_PHONE} variables={{ csrf, code }}>
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
                <span {...p} className="clickverify-btn">
                  {t("changephone")}
                </span>
              )}
            </AccountKit>
          );
        }}
      </Mutation>
    );
  }
}

export default ChangePhoneBtn;
