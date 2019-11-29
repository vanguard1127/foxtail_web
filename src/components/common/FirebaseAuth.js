import React from "react";
import PropTypes from "prop-types";
import * as firebase from "firebase/app";
import "firebase/auth";
import ConfirmPhone from "../Modals/ConfirmPhone";

class FirebaseAuth extends React.PureComponent {
  state = {
    showPhoneDialog: false
  };

  componentDidMount() {
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

  render() {
    const { ErrorHandler, type, onResponse, children, title } = this.props;
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
                  showPhoneDialog: false
                },
                () => {
                  onResponse({
                    csrf: process.env.REACT_APP_CSRF,
                    code: result,
                    password
                  });
                }
              );
            }}
            close={() => {
              this.setState({
                showPhoneDialog: false
              });
            }}
            sendCode={this.sendCode}
          ></ConfirmPhone>
        ) : null}
        <span onClick={this.signIn}>{children}</span>

        <div id="recaptcha-container" style={{ display: "none" }}></div>
      </>
    );
  }
}

FirebaseAuth.propTypes = {
  onResponse: PropTypes.func.isRequired,
  debug: PropTypes.bool,
  disabled: PropTypes.bool
};

FirebaseAuth.defaultProps = {
  debug: false,
  disabled: false
};

export default FirebaseAuth;
