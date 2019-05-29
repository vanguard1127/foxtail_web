import React from "react";
import PropTypes from "prop-types";

function initializeAccountKit(props, callback) {
  (cb => {
    const tag = document.createElement("script");
    tag.setAttribute(
      "src",
      `https://sdk.accountkit.com/${props.language}/sdk.js`
    );
    tag.setAttribute("id", "account-kit");
    tag.setAttribute("type", "text/javascript");
    tag.onload = cb;
    document.head.appendChild(tag);
  })(() => {
    console.log("open popup");
    window.AccountKit_OnInteractive = function() {
      const { appId, csrf, version, debug, display, redirect } = props;
      window.AccountKit.init({
        appId,
        state: csrf,
        version,
        debug,
        display,
        redirect,
        fbAppEventsEnabled: false
      });
      callback();
    };
  });
}

class AccountKit extends React.PureComponent {
  state = {
    initialized: !!window.AccountKit
  };

  componentDidMount() {
    if (!document.getElementById("account-kit")) {
      this.mounted = true;
      console.log("component did mount");
      if (!this.state.initialized) {
        delete window.AccountKit;
        delete window.AccountKit_OnInteractive;
        initializeAccountKit(
          {
            appId: this.props.appId,
            csrf: this.props.csrf,
            version: this.props.version,
            debug: this.props.debug,
            display: this.props.display,
            redirect: this.props.redirect,
            language: this.props.language
          },
          this.onLoad
        );
      }
    }
  }

  componentDidUpdate() {
    if (!document.getElementById("account-kit")) {
      if (!this.state.initialized) {
        delete window.AccountKit;
        delete window.AccountKit_OnInteractive;
        initializeAccountKit(
          {
            appId: this.props.appId,
            csrf: this.props.csrf,
            version: this.props.version,
            debug: this.props.debug,
            display: this.props.display,
            redirect: this.props.redirect,
            language: this.props.language
          },
          this.onLoad
        );
      }
    }
  }

  componentWillUnmount() {
    if (document.getElementById("account-kit")) {
      console.log("componentWillUnmount");
      this.mounted = false;
      delete window.AccountKit_OnInteractive;
      delete window.AccountKit;
      document.head.removeChild(document.getElementById("account-kit"));
    }
  }

  onLoad = () => {
    if (this.mounted) {
      this.setState({
        initialized: true
      });
    }
  };

  signIn = async e => {
    console.log(e, this.props, "SignInaccountKit");
    e.preventDefault();
    if (this.props.disabled && !(await this.props.validateForm())) {
      return false;
    } else {
      const {
        loginType,
        onResponse,
        countryCode,
        phoneNumber,
        emailAddress
      } = this.props;

      const options = {};
      if (countryCode) {
        options.countryCode = countryCode;
      }

      if (loginType === "PHONE" && phoneNumber) {
        options.phoneNumber = phoneNumber;
      } else if (loginType === "EMAIL" && emailAddress) {
        options.emailAddress = emailAddress;
      }

      window.AccountKit.login(loginType, options, resp => onResponse(resp));
    }
  };

  render() {
    console.log(
      this.mounted,
      "mounted",
      this.state.initialized,
      "initialized",
      "render"
    );
    if (!this.mounted) {
      return null;
    }
    return (
      <div
        onClick={() => {
          console.log("clicked on signin");
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

AccountKit.propTypes = {
  csrf: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  onResponse: PropTypes.func.isRequired,
  loginType: PropTypes.oneOf(["PHONE", "EMAIL"]),
  debug: PropTypes.bool,
  disabled: PropTypes.bool,
  display: PropTypes.oneOf(["popup", "modal"]),
  redirect: PropTypes.string,
  language: PropTypes.string,
  countryCode: PropTypes.string,
  phoneNumber: PropTypes.string,
  emailAddress: PropTypes.string
};

AccountKit.defaultProps = {
  debug: false,
  disabled: false,
  display: "popup",
  language: "en_US",
  loginType: "PHONE"
};

export default AccountKit;
