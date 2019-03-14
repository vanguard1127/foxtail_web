import React, { PureComponent } from 'react';
import { Mutation } from 'react-apollo';
import { FB_RESET_PHONE } from '../../../queries';
import AccountKit from 'react-facebook-account-kit';

const initialState = {
  csrf: '',
  code: ''
};
class ResetPhoneButton extends PureComponent {
  state = { ...initialState };
  handleFBReturn = ({ state, code }, fbResetPhone) => {
    const { t } = this.props;
    this.setState({
      csrf: state,
      code
    });
    fbResetPhone()
      .then(async ({ data }) => {
        if (data.fbResetPhone === null) {
          alert(t('noUserError') + '.');
          return;
        } else {
          alert('Phone Login Updated.');
          localStorage.setItem(
            'token',
            data.fbResetPhone.find(token => token.access === 'auth').token
          );
          localStorage.setItem(
            'refreshToken',
            data.fbResetPhone.find(token => token.access === 'refresh').token
          );
          //  await this.props.refetch();
          this.props.history.push('/members');
        }
      })
      .catch(res => {
        console.log(res);
        const errors = res.graphQLErrors.map(error => {
          return error.message;
        });
        this.setState({ errors });
      });
  };
  render() {
    const { csrf, code } = this.state;
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
              csrf={'889306f7553962e44db6ed508b4e8266'} // Required for security
              countryCode={'+1'} // eg. +60
              phoneNumber={''} // eg. 12345678
              emailAddress={'noreply@foxtailapp.com'} // eg. me@site.com
              language={localStorage.getItem('i18nextLng')}
            >
              {p => (
                <span className="color" {...p}>
                  Update Phone Number
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
