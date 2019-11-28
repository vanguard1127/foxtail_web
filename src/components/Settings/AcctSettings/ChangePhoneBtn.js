import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { toast } from "react-toastify";
import { FB_RESET_PHONE } from "../../../queries";
import FirebaseAuth from "../../common/FirebaseAuth";

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
    const { t, ReactGA } = this.props;
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
        ReactGA.event({
          category: "Settings",
          action: "Change Phone"
        });
        toast.success(t("changenum"));
      })
      .catch(res => {
        this.props.ErrorHandler.catchErrors(res.graphQLErrors);
      });
  };

  render() {
    const { csrf, code } = this.state;
    const { t, lang, ErrorHandler } = this.props;
    return (
      <Mutation mutation={FB_RESET_PHONE} variables={{ csrf, code }}>
        {fbResetPhone => {
          return (
            <FirebaseAuth
              language={lang}
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
