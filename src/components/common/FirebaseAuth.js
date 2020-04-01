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

  sendCode = async phone => {
    this.props.ErrorHandler.setBreadcrumb("sendCode");
    var appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible"
          // other options
        }
      );
      appVerifier = window.recaptchaVerifier;
    }
    return appVerifier.render().then(widgetId => {
      return firebase
        .auth()
        .signInWithPhoneNumber(phone, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
        })
        .catch(function(error) {
          // Error; SMS not sent
          console.error(
            "Error during signInWithPhoneNumber",
            error.message,
            error.code
          );
          if (error.code === "auth/too-many-requests") {
            alert(
              "We've detected unusual activity from this device. Please try again later."
            );
            window.location.reload(true);
          }
          if (window.applicationVerifier && this.recaptchaWrapperRef) {
            window.applicationVerifier.clear();
          }
        });
    });
  };

  resetReCaptcha = () => {
    if (window.applicationVerifier && this.recaptchaWrapperRef) {
      window.applicationVerifier.clear();
      this.recaptchaWrapperRef.innerHTML = `<div id="recaptcha-container"></div>`;
    }
  };

  confirmPhone = async code => {
    if (window.confirmationResult) {
      return window.confirmationResult.confirm(code).then(async result => {
        return await result.user.getIdToken();
      });
    } else {
      alert("Login Error Occured. Please try again later.");
    }
  };

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
          this.resetReCaptcha();
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
                  resetReCaptcha={this.resetReCaptcha}
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
