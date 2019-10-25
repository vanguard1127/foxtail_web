import React from "react";
import PropTypes from "prop-types";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import ConfirmPhone from "../Modals/ConfirmPhone";


function initializeFirebaseAuth(props, callback) {
  callback();
}

class FirebaseAuth extends React.PureComponent {
  state = {
    initialized: !!window.recaptchaVerifier,
    showPhoneDialog:false,
  };

  componentDidMount() {
    this.mounted = true;
    
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onLoad = () => {
    if (this.mounted) {
      this.setState({
        initialized: true
      });
    }
  };

  signIn = async e => {
    e.preventDefault();
    if (this.props.disabled && !(await this.props.validateForm())) {
      return false;
    }
      this.setState({
        showPhoneDialog:true,
      });
    return;
   
};

  async sendCode(phone){
    var appVerifier = window.recaptchaVerifier;
    return recaptchaVerifier.render().then(function(widgetId) {
      return firebase.auth().signInWithPhoneNumber(phone, appVerifier).then((confirmationResult)=>{
        window.confirmationResult = confirmationResult;
      });
    });
  }

  async confirmPhone(code){
    return window.confirmationResult.confirm(code).then(async result=>{
      return await (result.user.getIdToken());
    });
  }

  render() {
    /*if (!this.mounted) {
      return null;
    }*/
    return <>
    {this.state.showPhoneDialog?
    <ConfirmPhone
    ErrorHandler={this.props.ErrorHandler}
    sendConfirmationMessage={this.sendCode}
    confirmPhone={this.confirmPhone}
    onSuccess={(result)=>{
      this.setState({
        showPhoneDialog:false,
      }, ()=>{
        this.props.onResponse({
          state: this.props.csrf,
          code: result
        }, this.props.fbResolve);
      });
     
    }}
    close={()=>{
      this.setState({
        showPhoneDialog:false,
      })
    }}
    sendCode={this.sendCode}
    >
    </ConfirmPhone>:null}
    <span onClick={this.signIn}>
    {this.props.children}    
    </span>
    </>;
  }
}

FirebaseAuth.propTypes = {
  csrf: PropTypes.string.isRequired,
  onResponse: PropTypes.func.isRequired,
  debug: PropTypes.bool,
  disabled: PropTypes.bool,
  phoneNumber: PropTypes.string,
};

FirebaseAuth.defaultProps = {
  debug: false,
  disabled: false,
};

export default FirebaseAuth;