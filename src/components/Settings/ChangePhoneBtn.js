import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import { FB_RESOLVE } from '../../queries';
import AccountKit from 'react-facebook-account-kit';

const initialState = {
  csrf: '',
  code: '',
  phone: ''
};

class ChangePhoneBtn extends PureComponent {
  state = { ...initialState };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleFBReturn = ({ state, code }, fbResolve) => {
    if (!state || !code) {
      return toast.error('Error validating phone number');
    }
    const { t } = this.props;
    if (this.mounted) {
      this.setState({
        csrf: state,
        code
      });
    }
    fbResolve()
      .then(({ data }) => {
        if (data.fbResolve === null) {
          alert('Error Please try again later');
          return;
        }
        this.props.setValue(data.fbResolve);
        toast.success('Phone number has been changed');
      })
      .catch(res => {
        //TODO: Add event handler
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        this.setState({ errors });
      });
  };

  render() {
    const { csrf, code } = this.state;
    const { t } = this.props;
    return (
      <Mutation mutation={FB_RESOLVE} variables={{ csrf, code }}>
        {fbResolve => {
          return (
            <AccountKit
              appId="172075056973555" // Update this!
              version="v1.1" // Version must be in form v{major}.{minor}
              onResponse={resp => {
                this.handleFBReturn(resp, fbResolve);
              }}
              csrf={'889306f7553962e44db6ed508b4e8266'} // Required for security
              countryCode={'+1'} // eg. +60
              phoneNumber={''} // eg. 12345678
              emailAddress={'noreply@foxtailapp.com'} // eg. me@site.com
              language={localStorage.getItem('i18nextLng')}
            >
              {p => (
                <button {...p} className="login-btn">
                  Change Phone
                </button>
              )}
            </AccountKit>
          );
        }}
      </Mutation>
    );
  }
}

export default ChangePhoneBtn;
