import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESET_PHONE } from "../../../queries";
import FirebaseAuth from "../../common/FirebaseAuth";

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
    const { t, ErrorHandler, history, ReactGA } = this.props;
    if (!state || !code) {
      return;
    }

    if (this.mounted) {
      this.setState(
        {
          csrf: state,
          code
        },
        () => {
          fbResetPhone()
            .then(async ({ data }) => {
              if (data.fbResetPhone === null) {
                alert(t("noUserError") + ".");
                return;
              } else {
                alert(t("phoneupd"));
                ReactGA.event({
                  category: "Reset Phone",
                  action: "Success"
                });
                history.push("/members");
              }
            })
            .catch(res => {
              ReactGA.event({
                category: "Reset Phone",
                action: "Failuer"
              });
              ErrorHandler.catchErrors(res.graphQLErrors);
            });
        }
      );
    }
  };
  render() {
    const { csrf, code, lang } = this.state;
    const { t, token, ErrorHandler } = this.props;
    return (
      <Mutation mutation={FB_RESET_PHONE} variables={{ csrf, code, token }}>
        {fbResetPhone => {
          return (
            <FirebaseAuth
              csrf={"889306f7553962e44db6ed508b4e8266"}
              phoneNumber={""} // eg. 12345678
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
