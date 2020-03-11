import React, { PureComponent } from "react";
import { Mutation } from "react-apollo";
import { FB_RESOLVE } from "../../queries";
import PropTypes from "prop-types";
import * as firebase from "firebase/app";
import "firebase/auth";
import ConfirmPhone from "../Modals/ConfirmPhone";

class FirebaseAuth extends PureComponent {
  state = {
    showPhoneDialog: false,
    code: "",
    password: ""
  };

  componentDidMount() {
    if (process.env.NODE_ENV !== "production") {
      firebase.auth().settings.appVerificationDisabled = true;
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible"
        // other options
      }
    );
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  signIn = async e => {
    e.preventDefault();
    if (this.props.disabled && !(await this.props.validateForm())) {
      return false;
    }
    this.setState({
      showPhoneDialog: true
    });
    return;
  };

  async sendCode(phone) {
    var appVerifier = window.recaptchaVerifier;
    return appVerifier.render().then(function(widgetId) {
      return firebase
        .auth()
        .signInWithPhoneNumber(phone, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
        });
    });
  }

  async confirmPhone(code) {
    return window.confirmationResult.confirm(code).then(async result => {
      return await result.user.getIdToken();
    });
  }

  toggleConfirmPopup() {
    this.setState({ showPhoneDialog: !this.state.showPhoneDialog });
  }

  handleFirebaseReturn = fbResolve => {
    if (this.mounted) {
      const { loadingCB, success, failCB, ErrorHandler } = this.props;
      ErrorHandler.setBreadcrumb("Phone verification pressed");

      loadingCB && loadingCB();
      fbResolve()
        .then(async ({ data }) => {
          success(data);
        })
        .catch(err => {
          if (window.applicationVerifier && this.recaptchaWrapperRef) {
            window.applicationVerifier.clear();
            this.recaptchaWrapperRef.innerHTML = `<div id="recaptcha-container"></div>`;
          }
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible"
              // other options
            }
          );
          failCB && failCB(err);
        });
    }
  };

  render() {
    const { code, password } = this.state;
    const {
      ErrorHandler,
      type,
      children,
      title,
      toggleResetPhone,
      toggleResetPass,
      createData
    } = this.props;
    return (
      <Mutation
        mutation={FB_RESOLVE}
        variables={
          !createData
            ? {
                csrf: process.env.REACT_APP_CSRF,
                code,
                isCreate: false,
                password
              }
            : { ...createData, code, password }
        }
      >
        {fbResolve => {
          return (
            <>
              {this.state.showPhoneDialog ? (
                <ConfirmPhone
                  ErrorHandler={ErrorHandler}
                  sendConfirmationMessage={this.sendCode}
                  confirmPhone={this.confirmPhone}
                  title={title}
                  type={type}
                  onSuccess={(result, password) => {
                    this.setState(
                      {
                        showPhoneDialog: false,
                        code: result,
                        password
                      },
                      () => {
                        this.handleFirebaseReturn(fbResolve);
                      }
                    );
                  }}
                  close={() => {
                    this.toggleConfirmPopup();
                  }}
                  sendCode={this.sendCode}
                  toggleResetPhone={toggleResetPhone}
                  toggleResetPass={toggleResetPass}
                ></ConfirmPhone>
              ) : null}
              <span onClick={this.signIn}>{children}</span>
              <div
                ref={ref => (this.recaptchaWrapperRef = ref)}
                style={{ display: "none" }}
              >
                <div id="recaptcha-container"></div>
              </div>
            </>
          );
        }}
      </Mutation>
    );
  }
}

FirebaseAuth.propTypes = {
  debug: PropTypes.bool,
  disabled: PropTypes.bool
};

FirebaseAuth.defaultProps = {
  debug: false,
  disabled: false
};

export default FirebaseAuth;
